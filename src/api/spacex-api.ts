
import { 
  Launch, 
  Rocket, 
  LaunchesResponse, 
  LaunchesQueryParams 
} from '../types';
import { PAGE_SIZE, SPACEX_API_V4, } from '../utils/constant';
import axios from 'axios';


export const spacexApi = {
  async getLaunches({ 
    page = 1, 
    limit = PAGE_SIZE, 
    search = '',
    success,
    sortField,
    sortOrder
  }: LaunchesQueryParams = {}): Promise<LaunchesResponse> {
    try {
      const response = await axios.post<LaunchesResponse>(
        `${SPACEX_API_V4}/launches/query`,
        {
          query: {
            ...(search && {
              $or: [  
                { name: { $regex: search, $options: 'i' } },
                { details: { $regex: search, $options: 'i' } }
              ]
            }),
            ...(success !== undefined && { success })
          },
          options: {
            page,
            limit,
            sort: sortField && sortOrder ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } : { date_utc: 'desc' },
            populate: ['rocket']
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching launches:', error);
      throw error;
    }
  },

  async getLaunch(id: string): Promise<Launch> {
    try {
      const response = await axios.get<Launch>(
        `${SPACEX_API_V4}/launches/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching launch with ID ${id}:`, error);
      throw error;
    }
  },

  async getRocket(id: string): Promise<Rocket> {
    try {
      const response = await axios.get<Rocket>(
        `${SPACEX_API_V4}/rockets/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching rocket with ID ${id}:`, error);
      throw error;
    }
  },
};