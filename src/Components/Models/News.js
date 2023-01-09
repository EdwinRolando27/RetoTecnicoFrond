import gql from 'graphql-tag'


const NewsModel = {
    create: (client, {etiqueta, descripcion, contenido_html}, recursos) => client.query({
        query: gql`query createNews($etiqueta:String, $descripcion:String, $contenido_html: String){
                 createNews(etiqueta: $etiqueta, descripcion: $descripcion, contenido_html: $contenido_html){
                    ${recursos}
                }   
        }`, variables: {
            etiqueta, descripcion, contenido_html
        }
    }), update: (client, {id, update}, recursos) => client.query({
        query: gql`query updateNews($id: String, $update: JSON){
                updateNews(id: $id, update: $update){
                ${recursos}
                }
            }`, variables: {
            id, update
        }
    }), activateDelete: (client, {id, eliminar}) => client.query({
        query: gql`query eliminarActivarNews($id: String, $eliminar: Boolean){
        eliminarActivarNews(id: $id, eliminar: $eliminar){
            deleted_at, id
             }
        }`, variables: {
            id, eliminar
        }
    }), getAllOrNot: (client, {mostrar = false}, recursos) => client.query({
        query: gql`query selectNews ($mostrar: Boolean){
                selectNews(mostrar: $mostrar){
                    ${recursos}               
                }        
         }`, variables: {mostrar}, fetchPolicy: 'no-cache'
    }), getById: (client, {id}, recursos) => client.query({
        query: gql`query newsByID ($id: String){
                newsByID(id: $id){
                    ${recursos}               
                }        
         }`, variables: {id}, fetchPolicy: 'no-cache'
    })

}
export default NewsModel