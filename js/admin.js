const SUPABASE_URL='https://mqqkhliuveosvufpqjvh.supabase.co'

const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcWtobGl1dmVvc3Z1ZnBxanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI3MjUsImV4cCI6MjA5NDM1ODcyNX0.rMd3d-YTh3flvwIU9qK7y7fUesPNSw7z1Lj3A40IYjw'

const sb=supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
)

const loginForm=document.getElementById('login-form')
const dashboard=document.getElementById('dashboard')
const loginScreen=document.getElementById('login-screen')

loginForm.addEventListener('submit', async(e)=>{

e.preventDefault()

const email=document.getElementById('email').value
const password=document.getElementById('password').value

const {data,error}=await sb.auth.signInWithPassword({
email,
password
})

if(error){
document.getElementById('login-error').textContent=error.message
return
}

loginScreen.style.display='none'
dashboard.style.display='block'

document.getElementById('admin-email').textContent=data.user.email

loadProducts()
})

document.getElementById('logout-btn')
.addEventListener('click', async()=>{

await sb.auth.signOut()

location.reload()
})

async function loadProducts(){

const {data,error}=await sb
.from('products')
.select('*')
.order('created_at',{ascending:false})

if(error){
console.error(error)
return
}

const list=document.getElementById('products-list')

list.innerHTML=''

data.forEach(product=>{

const div=document.createElement('div')

div.className='product'

div.innerHTML=`
<h3>${product.name}</h3>
<p>${product.category || ''}</p>
<p>${product.description || ''}</p>

${product.image ? `<img src="${product.image}">` : ''}

<button onclick="deleteProduct('${product.id}')">
Delete
</button>
`

list.appendChild(div)
})
}

document.getElementById('product-form')
.addEventListener('submit', async(e)=>{

e.preventDefault()

const payload={
name:document.getElementById('product-name').value,
category:document.getElementById('product-category').value,
image:document.getElementById('product-image').value,
description:document.getElementById('product-description').value
}

const {error}=await sb
.from('products')
.insert(payload)

if(error){
alert(error.message)
return
}

document.getElementById('product-form').reset()

loadProducts()
})

async function deleteProduct(id){

if(!confirm('Delete product?')) return

const {error}=await sb
.from('products')
.delete()
.eq('id',id)

if(error){
alert(error.message)
return
}

loadProducts()
}