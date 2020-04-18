<template>
    <div id="chart" style="height: 500px;"></div>
</template>

<script>
import moment from 'dayjs';
import data from './data.js';
import { handleTime } from '../../utils/helper.js';
import tradeData from './trade-data.js';
var echarts = require('echarts');

export default {
    data() {
        return {};
    },
    mounted() {
        var upColor = '#ec0000';
        var upBorderColor = '#8A0000';
        var downColor = '#00da3c';
        var downBorderColor = '#008F28';

        var categoryData = [];
        var values = [];
        data.reverse().forEach((item) => {
            // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
            categoryData.push(item.Date);
            values.push([item.Open, item.Close, item.Low, item.High]);
        });
        const data0 = {
            categoryData: categoryData,
            values: values,
        };
        const longData = tradeData.filter(function (item) {
            if (item.side === 'long') {
                return true;
            }
            return false;
        });

        const shortData = tradeData.filter(function (item) {
            if (item.side === 'short') {
                return true;
            }
            return false;
        });

        var myChart = echarts.init(document.getElementById('chart'));
        // 绘制图表
        myChart.setOption({
            title: {
                text: '量化交易对比曲线图',
                left: 0,
            },
            legend: {
                data: ['小时K', 'long止损--开盘', 'long止损--收盘', 'short平仓--开盘', 'short平仓--收盘'],
            },
            // tooltip: {
            //     trigger: 'axis',
            //     axisPointer: {
            //         type: 'cross',
            //         animation: false,
            //         label: {
            //             backgroundColor: '#ccc',
            //             borderColor: '#aaa',
            //             borderWidth: 1,
            //             shadowBlur: 0,
            //             shadowOffsetX: 0,
            //             shadowOffsetY: 0,
            //             color: '#222',
            //         },
            //     },
            //     formatter: (params) => {
            //         let htmlF = '';
            //         params.forEach((item) => {
            //             htmlF += `<div class="tip">
            //                 <h3>名称：${item.seriesName}</h3>
            //                 <p>时间：${item.name}</p>
            //                 <p>价格：${item.value}</p>
            //               </div>`;
            //         });
            //         return htmlF;
            //     },
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                // data: data.reverse().map(function (item) {
                //     return moment(handleTime(item.Date)).format('YYYY-MM-DD hh:mm');
                // }),
                // axisLabel: {
                //     formatter: function (value, idx) {
                //         var date = new Date(value);
                //         return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                //     },
                // },
                // splitLine: {
                //     show: false,
                // },
                boundaryGap: false,
                data: data0.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true,
                },
                axisLabel: {
                    formatter: function (val) {
                        return val;
                    },
                },
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            return params.value;
                        },
                    },
                },
                splitNumber: 10,
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 50,
                    end: 100,
                },
                {
                    show: true,
                    type: 'slider',
                    top: '90%',
                    start: 50,
                    end: 100,
                },
            ],
            // dataZoom: [
            //     {
            //         type: 'inside',
            //         start: 0,
            //         end: 10,
            //     },
            //     {
            //         start: 0,
            //         end: 10,
            //         handleIcon:
            //             'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            //         handleSize: '80%',
            //         handleStyle: {
            //             color: '#fff',
            //             shadowBlur: 3,
            //             shadowColor: 'rgba(0, 0, 0, 0.6)',
            //             shadowOffsetX: 2,
            //             shadowOffsetY: 2,
            //         },
            //     },
            // ],
            series: [
                {
                    name: '小时K',
                    type: 'candlestick',
                    data: data0.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor,
                    },
                    markPoint: {
                        label: {
                            normal: {
                                formatter: function (param) {
                                    return param != null ? Math.round(param.value) : '';
                                },
                            },
                        },
                        data: [
                            {
                                name: 'XX标点',
                                coord: ['2013/5/31', 2300],
                                value: 2300,
                                itemStyle: {
                                    color: 'rgb(41,60,85)',
                                },
                            },
                            {
                                name: 'highest value',
                                type: 'max',
                                valueDim: 'highest',
                            },
                            {
                                name: 'lowest value',
                                type: 'min',
                                valueDim: 'lowest',
                            },
                            {
                                name: 'average value on close',
                                type: 'average',
                                valueDim: 'close',
                            },
                        ],
                        tooltip: {
                            formatter: function (param) {
                                return param.name + '<br>' + (param.data.coord || '');
                            },
                        },
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        data: [
                            [
                                {
                                    name: 'from lowest to highest',
                                    type: 'min',
                                    valueDim: 'lowest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        show: false,
                                    },
                                    emphasis: {
                                        label: {
                                            show: false,
                                        },
                                    },
                                },
                                {
                                    type: 'max',
                                    valueDim: 'highest',
                                    symbol: 'circle',
                                    symbolSize: 10,
                                    label: {
                                        show: false,
                                    },
                                    emphasis: {
                                        label: {
                                            show: false,
                                        },
                                    },
                                },
                            ],
                            {
                                name: 'min line on close',
                                type: 'min',
                                valueDim: 'close',
                            },
                            {
                                name: 'max line on close',
                                type: 'max',
                                valueDim: 'close',
                            },
                        ],
                    },
                },
                // {
                //     name: '趋势走线',
                //     type: 'line',
                //     data: data.map(function (item) {
                //         return item.Open;
                //     }),
                //     hoverAnimation: false,
                //     symbolSize: 6,
                //     itemStyle: {
                //         color: 'steelblue',
                //     },
                //     showSymbol: false,
                // },
                {
                    name: 'long止损--开盘',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'left',
                            color: '#333',
                            fontSize: 14,
                        },
                    },
                    symbolSize: 10,
                    itemStyle: {
                        color: '#7FFF00',
                    },
                    data: longData.map((item) => {
                        return [item.open_date, item.open];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'long止损--收盘',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'left',
                            color: '#333',
                            fontSize: 14,
                        },
                    },
                    symbolSize: 10,
                    itemStyle: {
                        color: '#800080',
                    },
                    data: longData.map((item) => {
                        return [item.close_date, item.close];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'short平仓--开盘',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'right',
                            color: '#333',
                            fontSize: 14,
                        },
                    },
                    symbolSize: 10,
                    itemStyle: {
                        color: 'red',
                    },
                    data: shortData.map(function (item) {
                        return [moment(handleTime(item.open_date)).format('YYYY-MM-DD hh:ss'), item.open];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'short平仓--收盘',
                    emphasis: {
                        label: {
                            show: true,
                            position: 'left',
                            color: '#333',
                            fontSize: 14,
                        },
                    },
                    symbolSize: 10,
                    itemStyle: {
                        color: '#800080',
                    },
                    data: shortData.map((item) => {
                        return [moment(handleTime(item.close_date)).format('YYYY-MM-DD hh:ss'), item.close];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'MA30',
                    type: 'line',
                    data: shortData
                        .map((item) => {
                            return [moment(handleTime(item.close_date)).format('YYYY-MM-DD hh:ss'), item.close];
                        })
                        .concat(
                            shortData.map(function (item) {
                                return [moment(handleTime(item.open_date)).format('YYYY-MM-DD hh:ss'), item.open];
                            })
                        )
                        .sort(function (a, b) {
                            var x = a[0];
                            var y = b[0];
                            return x > y ? -1 : x < y ? 1 : 0;
                        }),
                    smooth: false,
                    lineStyle: {
                        opacity: 0.5,
                    },
                },
            ],
        });
    },
};
</script>

<style>
.tip {
    font-size: 14px;
}
.tip h3 {
    margin: 0;
    font-size: 14px;
}
.tip p {
    margin: 0;
}
</style>
