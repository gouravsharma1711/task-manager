class ApiResponse<T>{
    statusCode:number;
    message:string;
    data:T | null ;

    constructor(
        statusCode:number,
        message:string = "Success",
        data:T | null = null 
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message
    }
}

export default ApiResponse;