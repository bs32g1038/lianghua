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
                text: '量化交易曲线图',
                left: 0,
            },
            legend: {
                data: [
                    '完整-小时K线',
                    '简易-小时k线',
                    'Long开仓',
                    'Long平仓',
                    'Short开仓',
                    'Short平仓',
                    'Long-k线',
                    'Short-k线',
                    '止盈平仓-k线',
                ],
                selected: {
                    '完整-小时K线': false,
                    'Long开仓': false,
                    'Long平仓': false,
                    'Short开仓': false,
                    'Short平仓': false,
                    'Long-k线': false,
                    'Short-k线': false,
                    '止盈平仓-k线': false,
                },
            },
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
            series: [
                {
                    name: '完整-小时K线',
                    type: 'candlestick',
                    data: data0.values,
                    itemStyle: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upBorderColor,
                        borderColor0: downBorderColor,
                    }
                },
                {
                    name: '简易-小时k线',
                    type: 'line',
                    data: data.map(function (item) {
                        return [item.Date, item.Open, item.Close, item.Low, item.High];
                    }),
                    hoverAnimation: false,
                    symbolSize: 6,
                    itemStyle: {
                        color: 'steelblue',
                    },
                    showSymbol: false,
                },
                {
                    name: 'Long开仓',
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
                    name: 'Long平仓',
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
                    name: 'Short开仓',
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
                        return [item.open_date, item.open];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'Short平仓',
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
                        return [item.close_date, item.close];
                    }),
                    type: 'scatter',
                },
                {
                    name: 'Long-k线',
                    type: 'line',
                    data: longData
                        .map((item) => {
                            return [
                                [item.open_date, item.open],
                                [item.close_date, item.close],
                            ];
                        })
                        .flat(),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5,
                    },
                },
                {
                    name: 'Short-k线',
                    type: 'line',
                    data: shortData
                        .map((item) => {
                            return [
                                [item.open_date, item.open],
                                [item.close_date, item.close],
                            ];
                        })
                        .flat(),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.5,
                    },
                },
                {
                    name: '止盈平仓-k线',
                    type: 'line',
                    data: tradeData
                        .map((item) => {
                            return [
                                [item.open_date, item.open],
                                [item.close_date, item.close],
                            ];
                        })
                        .flat(),
                    smooth: true,
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
