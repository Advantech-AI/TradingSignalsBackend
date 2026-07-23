import { supabaseclient } from './SupabaseConnection'


const testConnection = async () => {
    try {

        const { data, error } = await supabaseclient.from("_dummy_query").select("*").limit(1)
        

        if(error && (error.code == "PGRST204" || error.code == "42P01")){
            console.log("Correctamente conectado")
            return;
            
        }

        if(error){
            console.log("Connection issue: " + error.message)
        }

        console.log("Conexion exitosa")
    } catch (error:any) {
        console.error(error.message)
    }
}

testConnection()