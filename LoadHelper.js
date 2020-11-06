 
class LoadHelper {
    // 贷款本金
    // let totalMoney;

    //  贷款月数
    // let month;

    //  贷款年利率
    // let yearRatio;

    //  贷款月利率
    // let monthRatio;

    // 起息日
    //let starData

    constructor(totalMoney, month, yearRatio, starData) {
        this.totalMoney = totalMoney;
        this.month = month;
        this.yearRatio = yearRatio;
        this.monthRatio = yearRatio / 12;
        this.starData = starData;
    }

    // 某个月的日利率
    dayRation(mDate) {
        let days = this.getCountDays(mDate);
        return this.monthRatio / days;
    }

    // 第n期月供明细
    getNPayDetail(n) {
        return {
            captial: this.getPayNMonthMoney(n),
            ration: this.getPayNMonthRation(n)
        };
    }

    // 每月应还本金 贷款本金*月利率*（1+月利率）^(还款月序号-1)/（（1+月利率）^还款月数-1）
    getPayNMonthMoney(n) {
        return this.totalMoney * this.monthRatio * Math.pow((1 + this.monthRatio), (n - 1)) / (Math.pow((1 + this.monthRatio), this.month) - 1);
    }

    // 每月应还利息 贷款本金*月利率*[（1+月利率）^ 还款月数-（1+月利率)^(还款月序号-1)]/[(1+月利率)^还款月数-1]
    getPayNMonthRation(n) {
        if (n == 1) {
            // 第一期的月有多少天
            let days = this.getCountDays(this.starData);
            // 第一期用了多少天
            let useDays = days - new Date(this.starData).getDate() + 1;
            // 第一期的利息多少
            return useDays * this.dayRation(this.starData) * this.totalMoney;
        }
        return this.totalMoney * this.monthRatio * (Math.pow((1 + this.monthRatio), this.month) - Math.pow((1 + this.monthRatio), (n - 1))) / (Math.pow((1 + this.monthRatio), this.month) - 1);
    }


    // 月供计算器
    // 每月还款额=贷款本金×[月利率×(1+月利率) ^ 还款月数]÷{[(1+月利率) ^ 还款月数]-1}

    getMonthPay() {
        // 月利率
        let row = Math.pow(1 + this.monthRatio, this.month);
        let result = this.totalMoney * this.monthRatio * row / (row - 1);
        return result;
    }

    // 一共还了多少本金
    payTotalCapital(n) {
        let result = 0;
        for (let i = n; i > 0; i--) {
            result += this.getPayNMonthMoney(i);
        }
        return result;
    }

    // 一共还了多少利息
    payTotalRation(n) {
        let result = 0;
        for (let i = n; i > 0; i--) {
            result += this.getPayNMonthRation(i);
        }
        return result;
    }

    // 还剩多少本金未还
    needPayCaptial(n) {
        return this.totalMoney - this.payTotalCapital(n);
    }

    // 按日期查询还剩多少本金未还
    needPayCaptialByData(){
        let d = new Date(this.starData);
        let reduce = new Date().getTime()-d.getTime();
        let n =  Math.round(reduce/1000/3600/24/30);
        return this.needPayCaptial(n);
    }

    // 获取当月的天数
    getCountDays(mDate) {
        let curDate = new Date(mDate);
        /* 获取当前月份 */
        let curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }
}