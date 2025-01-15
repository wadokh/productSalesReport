import {ProductSalesReport} from "./salesReport/Product-sales-report";
import {VariantSalesReport} from "./salesReport/Variant-sales-report";

const productSalesReport = new ProductSalesReport();
const variantSalesReport = new VariantSalesReport();

(async () => {
    await productSalesReport.processSalesData();
    await variantSalesReport.processSalesData();
})();