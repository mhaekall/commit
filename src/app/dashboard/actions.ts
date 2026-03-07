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

    // 3. Handle File Uploads (Logo & QRIS)
    let logoUrl: string | null = null;
    let qrisUrl: string | null = null;
    
    // Get existing shop to preserve existing URLs
    const { data: existingShopData } = await supabase
      .from('shops')
      .select('id, location_data')
      .eq('org_id', org.id)
      .single();
    
    const existingLocationData = existingShopData?.location_data || {};
    
    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      try {
        logoUrl = await uploadFile(supabase, logoFile, `${org.id}/logos`) || existingLocationData.logo_url;
      } catch (e) {
        console.error('Logo upload failed:', e);
        logoUrl = existingLocationData.logo_url || null;
      }
    } else {
      logoUrl = existingLocationData.logo_url || null;
    }
    
    // Upload QRIS if provided
    if (qrisFile && qrisFile.size > 0) {
      try {
        qrisUrl = await uploadFile(supabase, qrisFile, `${org.id}/qris`) || existingLocationData.qris_url;
      } catch (e) {
        console.error('QRIS upload failed:', e);
        qrisUrl = existingLocationData.qris_url || null;
      }
    } else {
      qrisUrl = existingLocationData.qris_url || null;
    }

    // 4. Handle Shops (UPSERT manual)
    const { data: shopExistingData } = await supabase
      .from('shops')
      .select('id')
      .eq('org_id', org.id)
      .single();

    const locationData = { logo_url: logoUrl, qris_url: qrisUrl };
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .upsert({
        id: shopExistingData?.id,
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
