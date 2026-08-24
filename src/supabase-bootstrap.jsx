import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tiiavyrxereitetmxoku.supabase.co'
const SUPABASE_KEY = 'sb_publishable_FXvsyOMH3m-KMb--CXHvng_40fGsiK2'
const PRODUCT_KEY = 'petmaster-products'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const originalSetItem = Storage.prototype.setItem
let syncing = false

const initialProducts = [
  {id:'1',name:'Ração Premium para Cães',price:89.9,cat:'Alimentação',stock:12,img:'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80'},
  {id:'2',name:'Petisco Natural',price:24.9,cat:'Alimentação',stock:25,img:'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80'},
  {id:'3',name:'Cama Confort Pet',price:129.9,cat:'Casa e Conforto',stock:8,img:'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=700&q=80'},
  {id:'4',name:'Shampoo Higiene & Cuidado',price:39.9,cat:'Higiene',stock:18,img:'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=700&q=80'},
  {id:'5',name:'Bola Interativa para Pets',price:34.9,cat:'Brinquedos',stock:16,img:'https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=700&q=80'},
  {id:'6',name:'Suplemento e Cuidados',price:59.9,cat:'Saúde',stock:10,img:'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=700&q=80'}
]

async function syncProducts(products) {
  if (syncing) return
  syncing = true
  try {
    const { data: existing = [] } = await supabase.from('products').select('id,name')
    const byId = new Map(existing.map(p => [String(p.id), p]))
    const byName = new Map(existing.map(p => [p.name, p]))
    const keptIds = []
    for (const p of products) {
      const match = byId.get(String(p.id)) || byName.get(p.name)
      const row = {name:p.name, price:Number(p.price)||0, category:p.cat||'Alimentação', stock:Math.max(0,Number(p.stock)||0), image_url:p.img||null, active:true, updated_at:new Date().toISOString()}
      if (match) {
        keptIds.push(match.id)
        await supabase.from('products').update(row).eq('id', match.id)
      } else {
        const {data} = await supabase.from('products').insert(row).select('id').single()
        if (data) keptIds.push(data.id)
      }
    }
    for (const p of existing) if (!keptIds.includes(p.id)) await supabase.from('products').update({active:false}).eq('id',p.id)
  } finally { syncing = false }
}

async function hydrateProducts() {
  const {data,error} = await supabase.from('products').select('*').eq('active',true).order('id')
  if (error) throw error
  if (!data?.length) {
    const local = JSON.parse(localStorage.getItem(PRODUCT_KEY) || 'null') || initialProducts
    await syncProducts(local)
    return
  }
  const products = data.map(p => ({id:String(p.id),name:p.name,price:Number(p.price),cat:p.category||'Alimentação',stock:Number(p.stock||0),img:p.image_url||''}))
  originalSetItem.call(localStorage, PRODUCT_KEY, JSON.stringify(products))
}

Storage.prototype.setItem = function(key,value) {
  originalSetItem.call(this,key,value)
  if (this === localStorage && key === PRODUCT_KEY && !syncing) {
    try { syncProducts(JSON.parse(value)) } catch {}
  }
}

async function boot() {
  try { await hydrateProducts() }
  catch (error) { console.warn('PetMaster: Supabase indisponível; usando dados locais.', error) }
  await import('./main.jsx')
}

boot()
