'use server';

import { createServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

async function uploadProductImage(supabase: any, file: File, shopId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${shopId}/${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);
  
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function saveProduct(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createServerComponentClient();
  
  // 1. Verifikasi User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: 'Sesi berakhir, silakan login.' };

  // 2. Dapatkan shop_id milik user dari tabel memberships
  const { data: membership, error: shopError } = await supabase
    .from('memberships')
    .select('shop_id')
    .eq('user_id', user.id)
    .single();

  if (shopError || !membership?.shop_id) {
    return { success: false, message: 'Toko tidak ditemukan. Silakan buat profil toko dahulu.' };
  }

  const shopId = membership.shop_id;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const isVisible = formData.get('isVisible') === 'on';
  const imageFile = formData.get('image') as File;

  try {
    let imageUrl = null;
    
    // 3. Upload Gambar jika ada
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadProductImage(supabase, imageFile, shopId);
      } catch (uploadError) {
        console.error('Image upload failed, continuing without image:', uploadError);
        // Continue without image if upload fails
      }
    }

    // 4. Simpan ke Tabel products
    const { error: insertError } = await supabase
      .from('products')
      .insert({
        shop_id: shopId,
        name: name,
        price: price, // Simpan sebagai NUMERIC
        is_visible: isVisible,
        images: imageUrl ? [{ url: imageUrl, alt: name }] : [], // JSONB Array
      });

    if (insertError) throw insertError;

    revalidatePath('/dashboard/products');
    return { success: true, message: 'Produk berhasil ditambahkan!' };

  } catch (error: any) {
    console.error('Save Product Error:', error);
    return { success: false, message: error.message || 'Gagal menyimpan produk.' };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  productId: string,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createServerComponentClient();
  
  // 1. Verifikasi User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: 'Sesi berakhir, silakan login.' };

  // 2. Verify ownership via memberships
  const { data: membership, error: shopError } = await supabase
    .from('memberships')
    .select('shop_id')
    .eq('user_id', user.id)
    .single();

  if (shopError || !membership?.shop_id) {
    return { success: false, message: 'Toko tidak ditemukan.' };
  }

  const shopId = membership.shop_id;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const isVisible = formData.get('isVisible') === 'on';
  const imageFile = formData.get('image') as File;

  try {
    // 3. Get existing product to preserve existing images
    const { data: existingProduct } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId)
      .single();

    let images = existingProduct?.images || [];
    
    // 4. Upload new image if provided
    if (imageFile && imageFile.size > 0) {
      const newImageUrl = await uploadProductImage(supabase, imageFile, shopId);
      images = [{ url: newImageUrl, alt: name }];
    }

    // 5. Update the product
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: name,
        price: price,
        is_visible: isVisible,
        images: images,
      })
      .eq('id', productId)
      .eq('shop_id', shopId); // Ensure ownership

    if (updateError) throw updateError;

    revalidatePath('/dashboard/products');
    return { success: true, message: 'Produk berhasil diperbarui!' };

  } catch (error: any) {
    console.error('Update Product Error:', error);
    return { success: false, message: error.message || 'Gagal memperbarui produk.' };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createServerComponentClient();
  
  // 1. Verifikasi User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: 'Sesi berakhir, silakan login.' };

  // 2. Verify ownership via memberships
  const { data: membership, error: shopError } = await supabase
    .from('memberships')
    .select('shop_id')
    .eq('user_id', user.id)
    .single();

  if (shopError || !membership?.shop_id) {
    return { success: false, message: 'Toko tidak ditemukan.' };
  }

  try {
    // 3. Delete the product (RLS will enforce ownership)
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('shop_id', membership.shop_id);

    if (deleteError) throw deleteError;

    revalidatePath('/dashboard/products');
    return { success: true, message: 'Produk berhasil dihapus!' };

  } catch (error: any) {
    console.error('Delete Product Error:', error);
    return { success: false, message: error.message || 'Gagal menghapus produk.' };
  }
}
