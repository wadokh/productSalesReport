import {OrdersReport} from "./salesReport/Orders-report";
import {ProductVariantReport} from "./salesReport/Product-variant-report";


const productVariantSalesReport = new ProductVariantReport();
const ordersReport = new OrdersReport();

(async () => {
    //await ordersReport.processSalesData();
    await productVariantSalesReport.processSalesData();
})();