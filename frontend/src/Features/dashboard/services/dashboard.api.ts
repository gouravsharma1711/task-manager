import apiClient from "../../../shared/services/apiClient";


export const getDashBoardStats = async ()=>{
    const response = await apiClient.get('/tasks/stats');

    return response.data.data;
} 