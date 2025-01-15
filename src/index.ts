import {ProductSalesReport} from "./salesReport/product-sales-report";
import {VariantSalesReport} from "./salesReport/variant-sales-report";

const productSalesReport = new ProductSalesReport();

productSalesReport.processSalesData();

const variantSalesReport = new VariantSalesReport();

variantSalesReport.processSalesData();