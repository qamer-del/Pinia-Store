import { defineStore } from "pinia";
import { groupBy } from "lodash";
import { useAuthUserStore } from "@/stores/AuthUserStore";
import { useLocalStorage } from "@vueuse/core";
export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: useLocalStorage("CartStore:items",[]) ,
    };
  },
  getters:{
    test: (state) => state.items.length,
    isEmpty: (state) => state.test === 0,
    grouped: (state) => {
        const grouped = groupBy(state.items, (item) => item.name);
        const sorted = Object.keys(grouped).sort();
        let inOrder = {};
        sorted.forEach((key) => (inOrder[key] = grouped[key]));
        return inOrder;
      },
    groupCount: (state) => (name) => state.grouped[name].length,
    total: (state) => state.items.reduce((p, c) => p + c.price, 0),
  },
  
  actions: {
    checkout() {
        const authUserStore = useAuthUserStore();
        alert(
          `${authUserStore.username} just bought ${this.test} items at a total of $${this.total}`
        );
      },
    addItems(count, item) {
      count = parseInt(count);
      for (let index = 0; index < count; index++) {
        this.items.push({ ...item });
      }
    },
    clearItem(itemName) {
        this.items = this.items.filter((item) => item.name !== itemName);
      },
      setItemCount(item, count) {
        this.clearItem(item.name);
        this.addItems(count, item);
      },
  },
 
});
