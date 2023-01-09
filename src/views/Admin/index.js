import React, {Fragment} from 'react'

import Medicos from './Medicos'
import PrivateRoute from '../../PrivateRoute'
import UserP from './User/index'
import Categoria from './Categorias'
import Recomendacion from './Recomendaciones'
import News from './News'
import Sugerencias from "./Sugerencias"
import PrivateMaster from "../../PrivateMaster";
import SugerenciaOnly from "./Sugerencias/Sugerencia";

const Admin = ({match, history}) => {
    return (
        <Fragment>
            <PrivateRoute exact path={"/admin/medicos"} component={Medicos}/>
            <PrivateRoute exact path={"/admin/users"} component={UserP}/>
            <PrivateRoute exact path={"/admin/categorias"} component={Categoria}/>
            <PrivateRoute exact path={"/admin/recomendaciones"} component={Recomendacion}/>
            <PrivateRoute exact path={"/admin/news"} component={News}/>
            <PrivateMaster exact path={"/admin/sugerencias"} component={Sugerencias}/>
            <PrivateMaster exact path={"/admin/sugerencia/:id"} component={SugerenciaOnly}/>
        </Fragment>
    )
}
export default Admin