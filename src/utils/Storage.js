import gql from "graphql-tag"

import {isToken} from "./scripts"

const Storage = {
    cuStorage: (client, {
        pcge_2010,
        pcge_2020,
        f_050100,
        f_060100,
        f_050200,
        f_031700,
        f_030100,
        f_032400,
        f_032000,
        empresa,
        e_050100,
        e_050300,
        e_050200,
        e_050400,
        e_060100,
        e_080100,
        e_080200,
        e_080300,
        e_140100,
        e_140200,
        e_empresa,
        type,
        scs_080100,
        scs_140100,
        scs_050100
    }, recursos) => {
        return client.mutate({
            mutation: gql`mutation cuStorage(
                    $pcge_2010: JSON, 
                    $pcge_2020: JSON, 
                    $f_050100: JSON, 
                    $f_060100: JSON, 
                    $f_050200: JSON, 
                    $f_031700: JSON, 
                    $f_030100: JSON, 
                    $f_032400: JSON 
                    $f_032000: JSON, 
                    $empresa: JSON,
                    $e_050100: JSON,
                    $e_050300: JSON,
                    $e_050200: JSON,
                    $e_050400: JSON,
                    $e_060100: JSON,
                    $e_080100: JSON,
                    $e_080200: JSON,
                    $e_080300: JSON,
                    $e_140100: JSON,
                    $e_140200: JSON,
                    $e_empresa: JSON,
                    $type: String,
                    $scs_080100: JSON,
                    $scs_140100: JSON,
                    $scs_050100: JSON
                ) {
                  cuStorage(
                     pcge_2010: $pcge_2010, 
                     pcge_2020: $pcge_2020, 
                     f_050100: $f_050100, 
                     f_060100: $f_060100, 
                     f_050200: $f_050200, 
                     f_031700: $f_031700, 
                     f_030100: $f_030100, 
                     f_032400: $f_032400 
                     f_032000: $f_032000, 
                     empresa: $empresa,
                     e_050100: $e_050100,
                     e_050300: $e_050300,
                     e_050200: $e_050200,
                     e_050400: $e_050400,
                     e_060100: $e_060100,
                     e_080100: $e_080100,
                     e_080200: $e_080200,
                     e_080300: $e_080300,
                     e_140100: $e_140100,
                     e_140200: $e_140200,
                     e_empresa: $e_empresa,
                     type: $type,
                     scs_080100: $scs_080100,
                     scs_140100: $scs_140100,
                     scs_050100: $scs_050100
                  ) {
                     ${recursos}
                  }
                }`,
            context: {headers: {isAuth: isToken()}},
            variables: {
                pcge_2010,
                pcge_2020,
                f_050100,
                f_060100,
                f_050200,
                f_031700,
                f_030100,
                f_032400,
                f_032000,
                empresa,
                e_050100,
                e_050300,
                e_050200,
                e_050400,
                e_060100,
                e_080100,
                e_080200,
                e_080300,
                e_140100,
                e_140200,
                e_empresa,
                type,
                scs_080100,
                scs_140100,
                scs_050100
            }
        })
    },
    getByUserId: (client, recursos) => {
        return client.query({
            query: gql`query {
                storage {
                    ${recursos}
                }
            }`,
            context: {headers: {isAuth: isToken()}},
            fetchPolicy: "no-cache"
        })
    }
}

export default Storage