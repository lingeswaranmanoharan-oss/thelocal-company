import apiEndpoints from '../../../services/apiEndPoints';
import HttpService from '../../../services/httpService';
import { getCompanyId } from '../../../utils/functions';

export const addHoliday = async (data) => {
  const response = await HttpService.post(apiEndpoints.addHoliday, {
    ...data,
    companyId: getCompanyId(),
  });
  return response;
};

// export const getHolidays=async()=>{
//   const response=await HttpService.get(apiEndpoints.getHolidays(getCompanyId()));
//   return response
// }

export const deleteHoliday=async(holidayId)=>{
 const response=await HttpService.delete(apiEndpoints.deleteHoliday(holidayId));
 return response;
}

export const updateHoliday=async(holidayId,data)=>{
  const response=await HttpService.put(apiEndpoints.updateHoliday(getCompanyId(),holidayId),data);
  return response;
}