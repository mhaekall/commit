import { createServerComponentClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const revalidate = 60; // ISR: Revalidate every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Simple QR Code component using canvas
function QRCodeCanvas({ value, size = 128 }: { value: string; size?: number }) {
  'use client';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={(canvas) => {
          if (canvas && typeof window !== 'undefined') {
            // Simple QR-like pattern (placeholder - in production use qrcode library)
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = size;
              canvas.height = size;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, size, size);
              ctx.fillStyle = '#1e293b';
              
              // Draw a simple grid pattern as placeholder
              const cellSize = size / 21;
              for (let i = 0; i < 21; i++) {
                for (let j = 0; j < 21; j++) {
                  // Position detection patterns (corners)
                  if ((i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7)) {
                    if ((i === 0 || i === 6 || j === 0 || j === 6) || 
                        (i === 2 || i === 4 || j === 2 || j === 4 && i < 7 && j < 7)) {
                      ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                    }
                  } else if ((i + j) % 3 === 0) {
                    ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
                  }
                }
              }
            }
          }
        }}
        width={size}
        height={size}
        className="rounded-lg"
      />
      <span className="text-xs text-slate-500">Scan untuk akses</span>
    </div>
  );
}

export default async function ShopCatalogPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerComponentClient();

  // Fetch shop by slug (join with organization)
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select(`
      *,
      organizations!inner(
        id,
        name,
        slug,
        owner_id
      )
    `)
    .eq('organizations.slug', slug)
    .eq('is_active', true)
    .single();

  if (shopError || !shop) {
    notFound();
  }

  // Fetch visible products for this shop
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('is_visible', true)
    .order('name');

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('is_visible', true)
    .order('sort_order');

  const shopName = shop.name || shop.organizations?.name;
  
  // Generate catalog URL for QR code
  const catalogUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${slug}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Shop Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {shopName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{shopName}</h1>
                <p className="text-sm text-slate-500">Katalog Digital</p>
              </div>
            </div>
            
            {/* QR Code Display */}
            <div className="hidden sm:block">
              <QRCodeCanvas value={catalogUrl} size={80} />
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white border-b border-slate-200 sticky top-[73px] z-40">
          <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
                Semua
              </button>
              {categories.map((cat) => (
                <button key={cat.id} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-slate-200 transition-colors">
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} shopName={shopName} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Belum ada produk tersedia.</p>
          </div>
        )}
      </div>

      {/* Mobile QR Code */}
      <div className="sm:hidden fixed bottom-4 right-4">
        <div className="bg-white p-2 rounded-2xl shadow-xl">
          <QRCodeCanvas value={catalogUrl} size={100} />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>Dipersembahkan oleh QR Katalog Digital</p>
      </footer>
    </main>
  );
}

function ProductCard({ product, shopName }: { product: any; shopName: string }) {
  const imageUrl = product.images?.[0]?.url;
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const handleOrder = () => {
    const message = `Halo ${shopName}, saya ingin memesan:\n\n${product.name}\nHarga: ${formattedPrice}\n\nMohon info selanjutnya.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
      <div className="relative aspect-square bg-slate-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <span className="text-4xl">📦</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
        <p className="text-indigo-600 font-bold mt-1">{formattedPrice}</p>
        <button onClick={handleOrder} className="w-full mt-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors">
          Pesan via WhatsApp
        </button>
      </div>
    </div>
  );
}
