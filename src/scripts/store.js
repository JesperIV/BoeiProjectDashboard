import { reactive } from 'vue';

//  Saves selected boei ID, NOT NAME
//  Allows me to use it in the router sections :)
export const state = reactive({
  selectedBoei: '',
  selectedDate: ''
});