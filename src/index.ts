import {OrdersReport} from "./salesReport/OrdersReport";
import {ProductVariantReport} from "./salesReport/ProductVariantReport";


const productVariantSalesReport = new ProductVariantReport();
const ordersReport = new OrdersReport();

(async () => {
    await ordersReport.processSalesData();
    // await productVariantSalesReport.processSalesData();
})();