import {ProductSalesReport} from "./salesReport/Product-sales-report";
import {VariantSalesReport} from "./salesReport/Variant-sales-report";
import {OrdersReport} from "./salesReport/Orders-report";

const productSalesReport = new ProductSalesReport();
const variantSalesReport = new VariantSalesReport();
const ordersReport = new OrdersReport();

(async () => {
    await ordersReport.processSalesData();
    // await productSalesReport.processSalesData();
    // await variantSalesReport.processSalesData();
})();