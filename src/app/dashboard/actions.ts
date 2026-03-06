'use server';

import { createServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

async function uploadFile(supabase: any, file: File, path: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('shop_assets')
    .upload(filePath, file);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
  
  const { data: { publicUrl } } = supabase.storage
    .from('shop_assets')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function saveShopProfile(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createServerComponentClient();
  
  // 1. Authenticate User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: 'Sesi berakhir, silakan login kembali.' };
  }

  const orgName = formData.get('orgName') as string;
  const slug = formData.get('slug') as string;
  const shopName = formData.get('shopName') as string;
  const logoFile = formData.get('logo') as File;
  const qrisFile = formData.get('qris') as File;

  try {
    // 2. Handle Organizations (UPSERT manual)
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .upsert({
        id: existingOrg?.id, // Jika ada ID, akan melakukan UPDATE. Jika tidak ada, akan melakukan INSERT.
        name: orgName,
        slug: slug,
        owner_id: user.id
      })
      .select()
      .single();

    if (orgError) throw orgError;

    // ... (logic file upload tetap sama) ...

    // 4. Handle Shops (UPSERT manual)
    const { data: existingShop } = await supabase
      .from('shops')
      .select('id')
      .eq('org_id', org.id)
      .single();

    const locationData = { logo_url: logoUrl, qris_url: qrisUrl };
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .upsert({
        id: existingShop?.id,
        org_id: org.id,
        name: shopName,
        location_data: locationData
      })
      .select()
      .single();

    if (shopError) throw shopError;

    // 5. AUTO-LINK USER TO MEMBERSHIPS (Crucial for RLS)
    const { error: membershipError } = await supabase
      .from('memberships')
      .upsert({
        user_id: user.id,
        shop_id: shop.id,
        role: 'Owner'
      }, { onConflict: 'user_id,shop_id' });

    if (membershipError) throw membershipError;

    revalidatePath('/dashboard');
    return { success: true, message: 'Profil toko dan keanggotaan berhasil diperbarui!' };

  } catch (error: any) {
    console.error('Save Profile Error:', error);
    return { success: false, message: error.message || 'Terjadi kesalahan sistem.' };
  }
}
