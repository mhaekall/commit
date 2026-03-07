'use server';

import { createServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function saveCategory(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createServerComponentClient();
  
  // 1. Verifikasi User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, message: 'Sesi berakhir, silakan login.' };

  // 2. Dapatkan shop_id milik user
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
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isVisible = formData.get('isVisible') === 'on';

  try {
    // 3. Simpan ke Tabel categories
    const { error: insertError } = await supabase
      .from('categories')
      .insert({
        shop_id: shopId,
        name: name,
        sort_order: sortOrder,
        is_visible: isVisible,
      });

    if (insertError) throw insertError;

    revalidatePath('/dashboard/categories');
    return { success: true, message: 'Kategori berhasil ditambahkan!' };

  } catch (error: any) {
    console.error('Save Category Error:', error);
    return { success: false, message: error.message || 'Gagal menyimpan kategori.' };
  }
}

export async function updateCategory(
  categoryId: string,
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

  const name = formData.get('name') as string;
  const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;
  const isVisible = formData.get('isVisible') === 'on';

  try {
    // 3. Update the category
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        name: name,
        sort_order: sortOrder,
        is_visible: isVisible,
      })
      .eq('id', categoryId)
      .eq('shop_id', membership.shop_id);

    if (updateError) throw updateError;

    revalidatePath('/dashboard/categories');
    return { success: true, message: 'Kategori berhasil diperbarui!' };

  } catch (error: any) {
    console.error('Update Category Error:', error);
    return { success: false, message: error.message || 'Gagal memperbarui kategori.' };
  }
}

export async function deleteCategory(
  categoryId: string
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
    // 3. Delete the category (RLS will enforce ownership)
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('shop_id', membership.shop_id);

    if (deleteError) throw deleteError;

    revalidatePath('/dashboard/categories');
    return { success: true, message: 'Kategori berhasil dihapus!' };

  } catch (error: any) {
    console.error('Delete Category Error:', error);
    return { success: false, message: error.message || 'Gagal menghapus kategori.' };
  }
}
