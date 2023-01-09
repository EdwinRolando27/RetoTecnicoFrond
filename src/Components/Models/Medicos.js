import gql from 'graphql-tag'

const MedicosModel = {
    create: (client, {nombres, apellidos, especialidad, dni, contenido_html, foto}, recursos) => client.query({
        query: gql`query createMedicos(
            $nombres: String, $apellidos: String, $especialidad: String, 
            $dni: String, $contenido_html: String, $foto: String
        ){
        createMedicos(
        nombres: $nombres, apellidos: $apellidos, especialidad: $especialidad, 
            dni: $dni, contenido_html: $contenido_html, foto: $foto
        ){${recursos}}
        }`, variables: {
            nombres, apellidos, especialidad, dni, contenido_html, foto
        }
    }), update: (client, {id, update}, recursos) => client.query({
        query: gql`query updateMedicos($id: String, $update: JSON){
                updateMedicos(id: $id, update: $update){
                ${recursos}
                }
            }`, variables: {
            id, update
        }
    }), activateDelete: (client, {id, eliminar}) => client.query({
        query: gql`query eliminarActivarMedico($id: String, $eliminar: Boolean){
        eliminarActivarMedico(id: $id, eliminar: $eliminar){
            deleted_at, id
             }
        }`, variables: {
            id, eliminar
        }
    }), getAllOrNot: (client, {mostrar = false}, recursos) => client.query({
        query: gql`query selectMedicos ($mostrar: Boolean){
                selectMedicos(mostrar: $mostrar){
                    ${recursos}               
                }        
         }`,
        variables: {mostrar}, fetchPolicy: 'no-cache'
    })
}
export default MedicosModel