import api from "./api";

const routeService = {

    async getRoute(truckId){

        const response = await api.get(`/route/${truckId}`);

        return response.data;

    }

};

export default routeService;