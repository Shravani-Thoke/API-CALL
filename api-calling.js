 //*****Global variables******
 var id = ''
 var edit_id = ''
 var edit_albumId = ''
 var maxId = 0
 var maxAlbumId = 0
 //****************************
 function fetch2(url, urlobj = { method: 'GET' }, data = {}) {
     return new Promise(function (resolve, reject) {

         var xhr = new XMLHttpRequest();
         xhr.open(urlobj.method, url);
         xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

         xhr.onload = function () {
             if (this.status == 200 && this.readyState == 4) {
                 resolve(JSON.parse(this.responseText))
             }
             if (this.status != 200) {
                 reject('error');
             }
         }

         if (urlobj.method == 'PUT' || urlobj.method == 'POST') {
             xhr.send(JSON.stringify(data))
         } else {
             xhr.send()
         }


     })
 }

 var baseUrl = "https://jsonplaceholder.typicode.com";
 var loader = document.querySelector('.spinner');
 document.querySelector('button.btn.btn-info').addEventListener("click", function (e) {
     loader.classList.remove('invisible')
     fetch2(baseUrl + '/photos', { method: 'GET' })
         .then(data => {
             loader.classList.add('invisible');
             console.log(data)

             var tr = `<table class="table table-bordered">
                 <thead>
                 <tr>
                     <th scope="col">albumId</th>
                     <th scope="col">id</th>
                     <th scope="col">title</th>
                     <th scope="col">url</th>
                     <th scope="col">thumbnailUrl</th>
                     <th scope="col">Action</th>
                 </tr>
                 </thead>
                 <tbody>`;

             data.forEach(element => {
                 tr += `<tr>
                 <td scope="row">`+ element.albumId + `</td>
                 <td>`+ element.id + `</td>
                 <td>`+ element.title + `</td>
                 <td><a target='_blank' href=`+ element.url + `>Link</a></td>
                 <td><img width="150" height="150" src=`+ element.thumbnailUrl + `></td>
                 <td>
                     <button class="btn btn-success view_btn" data-bs-toggle="modal" data-bs-target="#exampleModal_view">View</button>    
                     <button class="btn btn-primary edit_btn"  data-bs-toggle="modal" data-bs-target="#exampleModal_edit">Edit</button>    
                     <button class="btn btn-danger del_btn">Delete</button>    
                 </td>
             </tr>
             `;
             });
             tr += ` </tbody>
         </table>`;

             document.getElementById('table-container').innerHTML = tr;

             document.addEventListener('click', function (e) {
                 if (e.target && e.target.classList.contains('view_btn')) {
                     let albumId = e.target.closest('tr').querySelector('td:first-child').innerHTML
                     let id = e.target.closest('tr').querySelector('td:nth-child(2)').innerHTML
                     let title = e.target.closest('tr').querySelector('td:nth-child(3)').innerHTML
                     let url = e.target.closest('tr').querySelector('td:nth-child(4) > a').getAttribute('href')
                     let thumbnailUrl = e.target.closest('tr').querySelector('td:nth-child(5) > img').getAttribute('src')
                     // console.log(url)
                     // console.log(thumbnailUrl)

                     let lg = document.querySelector('.modal-body > .list-group')
                     //console.log(lg)

                     lg.querySelector('li:first-child').innerHTML = albumId;
                     lg.querySelector('li:nth-child(2)').innerHTML = id;
                     lg.querySelector('li:nth-child(3)').innerHTML = title;
                     document.getElementById('url').setAttribute('href', url);
                     document.getElementById('url').innerHTML = url;
                     document.getElementById('img').setAttribute('src', thumbnailUrl);

                 }
                 if (e.target && e.target.classList.contains('del_btn')) {
                     id = e.target.closest('tr').querySelector('td:nth-child(2)').innerHTML
                     fetch2(baseUrl + '/photos/' + id, { method: 'DELETE' })
                         .then(data => {
                             Swal.fire({
                                 title: "Good job!",
                                 text: "ID:" + id + " Deleted Successfully",
                                 icon: "success"
                             });
                         })
                     e.target.closest('tr').remove()

                 }

                 if (e.target && e.target.classList.contains('edit_btn')) {
                     id = e.target.closest('tr').querySelector('td:nth-child(2)').innerHTML
                     edit_id = e.target.closest('tr').querySelector('td:nth-child(2)')
                     console.log(id)

                     edit_albumId = e.target.closest('tr').querySelector('td:first-child').innerHTML
                     let title = e.target.closest('tr').querySelector('td:nth-child(3)').innerHTML
                     let url = e.target.closest('tr').querySelector('td:nth-child(4) > a').getAttribute('href')
                     let thumbnailUrl = e.target.closest('tr').querySelector('td:nth-child(5) > img').getAttribute('src')
                     console.log(url)
                     //console.log(thumbnailUrl)

                     // document.getElementById('albumId').value = albumId;
                     document.getElementById('title').value = title;
                     document.getElementById('edit-url').value = url;
                     document.getElementById('thumbnailUrl').value = thumbnailUrl;


                 }

             })

             document.querySelector('.update_btn').addEventListener('click', function (e) {
                 e.preventDefault();
                 console.log(id)
                 //var albumId = document.getElementById('albumId').value;
                 var title = document.getElementById('title').value;
                 var url = document.getElementById('edit-url').value;
                 var thumbnailUrl = document.getElementById('thumbnailUrl').value;

                 var mydata = {
                     albumId: edit_albumId,
                     id: id,
                     title: title,
                     url: url,
                     thumbnailUrl: thumbnailUrl
                 }
                 // console.log(mydata)

                 fetch2(baseUrl + '/photos/' + id, { method: 'PUT' }, mydata)
                     .then(data => {

                         let row = edit_id.closest('tr')

                         // row.querySelector('td:nth-child(1)').innerHTML = albumId
                         row.querySelector('td:nth-child(3)').innerHTML = title
                         row.querySelector('td:nth-child(4) > a').setAttribute('href', url)
                         row.querySelector('td:nth-child(4) > a').innerHTML = 'Link'
                         row.querySelector('td:nth-child(5) > img').setAttribute('src', thumbnailUrl)
                         console.log(edit_id.closest('tr'))

                         Swal.fire({
                         title: "Good job!",
                         text: "Record Edited Successfully!",
                         icon: "success"
                         });

                     })
                     .catch(error=>{
                         Swal.fire({
                         title: "Something went wrong!",
                         text: "Try Again!",
                         icon: "error"
                         });

                     })
             })

         })

 })
 document.querySelector('button.btn.btn-warning').addEventListener("click", function (e) {

     document.getElementById("myform").onsubmit = function (e) {
         e.preventDefault()
         let title = document.getElementById('add_title').value;
         let url = document.getElementById('add_url').value;
         let thumbnailUrl = document.getElementById('add_thumbnailUrl').value;
         fetch2(baseUrl + '/photos', { method: 'GET' })
             .then(data => {
                 // data.forEach(element => {
                 //     while(element.albumId>=maxAlbumId){
                 //         maxAlbumId=element.albumId;
                 //         var countID=0
                 //         while(countID<100){
                 //             data.forEach(element => {
                 //                 if(element.id>=maxId){
                 //                     maxId=element.id;
                 //                 }
                 //                 countID++;
                 //             });  
                 //             maxId++;
                 //         }
                 //         maxAlbumId++;
                 //     }
                 // });


                 data.forEach(element => {

                     if (element.albumId >= maxAlbumId) {
                         maxAlbumId = element.albumId;
                     }
                     if (element.id >= maxId) {
                         maxId = element.id;
                     }
                 

                 });
                 maxId++;
                 //maxAlbumId++;
                 
             })
             
             console.log(maxId)
             console.log(maxAlbumId)
             
         mydata = {
             albumId: maxAlbumId+1,
             id: maxId,
             title: title,
             url: url,
             thumbnailUrl: thumbnailUrl
         }
         fetch2(baseUrl + '/photos/' + id, { method: 'POST' }, mydata)
         .then(data=>{
             console.log(data)
             var table=document.querySelector('#table-container > tbody');
             var newRow=document.createElement('tr');
             newRow.innerHTML=`<td scope="row">`+ data.albumId + `</td>
                                 <td>`+ data.id + `</td>
                                 <td>`+ data.title + `</td>
                                 <td><a target='_blank' href=`+ data.url + `>Link</a></td>
                                 <td><img width="150" height="150" src=`+ data.thumbnailUrl + `></td>
                                 <td>
                                     <button class="btn btn-success view_btn" data-bs-toggle="modal" data-bs-target="#exampleModal_view">View</button>    
                                     <button class="btn btn-primary edit_btn"  data-bs-toggle="modal" data-bs-target="#exampleModal_edit">Edit</button>    
                                     <button class="btn btn-danger del_btn">Delete</button>    
                                 </td>`;
             table.appendChild(newRow)
         })
         .catch(error=>{
             console.log(error)
         })
         
         Swal.fire({
                     title: "Good job!",
                     text: "Record Added Successfully!",
                     icon: "success"
                     });

                     document.getElementById('myform').reset();
         
     }
 })
