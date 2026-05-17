
const sb=supabase.createClient(
'https://mqqkhliuveosvufpqjvh.supabase.co',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcWtobGl1dmVvc3Z1ZnBxanZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODI3MjUsImV4cCI6MjA5NDM1ODcyNX0.rMd3d-YTh3flvwIU9qK7y7fUesPNSw7z1Lj3A40IYjw'
)

document.getElementById('login-form')
.addEventListener('submit',async(e)=>{

e.preventDefault()

const {data,error}=await sb.auth.signInWithPassword({
email:document.getElementById('email').value,
password:document.getElementById('password').value
})

if(error){
document.getElementById('login-error').textContent=error.message
return
}

document.getElementById('login-screen').style.display='none'
document.getElementById('dashboard').style.display='block'
document.getElementById('admin-email').textContent=data.user.email

loadCategories()
loadProducts()
})

document.getElementById('logout-btn')
.addEventListener('click',async()=>{

await sb.auth.signOut()
location.reload()
})

async function loadCategories(){

const {data}=await sb.from('categories').select('*')

const select=document.getElementById('product-category')
select.innerHTML=''

const list=document.getElementById('categories-list')
list.innerHTML=''

data.forEach(cat=>{

const option=document.createElement('option')
option.value=cat.name
option.textContent=cat.name
select.appendChild(option)

const div=document.createElement('div')
div.className='category-item'

div.innerHTML=`
<span>${cat.name}</span>
<button onclick="deleteCategory('${cat.id}')">Delete</button>
`

list.appendChild(div)
})
}

document.getElementById('category-form')
.addEventListener('submit',async(e)=>{

e.preventDefault()

await sb.from('categories').insert({
name:document.getElementById('category-name').value
})

document.getElementById('category-form').reset()

loadCategories()
})

async function uploadImage(file){

const fileName=Date.now() + '-' + file.name

await sb.storage
.from('product-images')
.upload(fileName,file)

const {data}=sb.storage
.from('product-images')
.getPublicUrl(fileName)

return data.publicUrl
}

document.getElementById('product-form')
.addEventListener('submit',async(e)=>{

e.preventDefault()

let imageUrl=''

const file=document.getElementById('product-image-file').files[0]

if(file){
imageUrl=await uploadImage(file)
}

await sb.from('products').insert({
name:document.getElementById('product-name').value,
category:document.getElementById('product-category').value,
description:document.getElementById('product-description').value,
image:imageUrl
})

document.getElementById('product-form').reset()

loadProducts()
})

async function loadProducts(){

const {data}=await sb
.from('products')
.select('*')
.order('created_at',{ascending:false})

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
<button onclick="deleteProduct('${product.id}')">Delete</button>
`

list.appendChild(div)
})
}

async function deleteProduct(id){

await sb.from('products').delete().eq('id',id)

loadProducts()
}

async function deleteCategory(id){

await sb.from('categories').delete().eq('id',id)

loadCategories()
}
