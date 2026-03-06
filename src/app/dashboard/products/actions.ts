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
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${shopId}/products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product_images')
    .upload(filePath, file);

  if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);
  
  const { data: { publicUrl } } = supabase.storage
    .from('product_images')
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
      imageUrl = await uploadProductImage(supabase, imageFile, shopId);
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
