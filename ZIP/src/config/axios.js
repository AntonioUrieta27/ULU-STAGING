import axios from 'axios';

const clientAxios = axios.create({
    baseURL: 'https://ulu-back-storytelling.herokuapp.com/'
	//https://ulu-back-storytelling.herokuapp.com
    //http://localhost:4000
});

export default clientAxios;