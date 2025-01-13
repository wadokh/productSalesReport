"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDate = void 0;
exports.startDate = (function () {
    var date = new Date();
    date.setDate(date.getDate() - 90);
    return date.toISOString();
})();
