// 引入基本模板
// let echarts = require(‘echarts/lib/echarts‘)
var echarts = require('echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/candlestick')

require("echarts/lib/component/tooltip");
/**
 * 各种画echarts图表的方法都封装在这里
 */

import mdata from '../../static/temData.js' //临时假数据

const install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          line1: function (id) {
              this.chart = echarts.init(document.getElementById(id));
              if (id=='minutes') {
                  this.chart.setOption(setmOption());
              } else if(id == 'day1'){
                  this.chart.setOption(setkOption());
              }
            
            var that = this
          }
        }
      }
    },

  })
}
//分时图
var tmpVolumes = 0;
var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';
function splitData_m(rawData) {
    var categoryData = [];
    var values = [];
    var volumes = [];//成交量
    for (var i = 930; i <= 1130; i++) {
        var arr = (i < 1000 ? "0" + i + "" : "" + i + "").split(" ");
        var time1 = arr[0].substring(0, 2);
        var time2 = arr[0].substring(2, 4);
        if (parseInt(time2) <= 59) {
            categoryData.push(time1 + ":" + time2);
        }
    }
    for (var i = 1300; i <= 1500; i++) {
        var arr = i.toString().split(" ");
        var time1 = arr[0].substring(0, 2);
        var time2 = arr[0].substring(2, 4);
        if (parseInt(time2) <= 59) {
            categoryData.push(time1 + ":" + time2);
        }
    }
    // console.log(categoryData);
    for (var i = 0; i < rawData.length; i++) {
        var arr = rawData[i].split(" ");
        var time1 = arr[0].substring(0, 2);
        var time2 = arr[0].substring(2, 4);
        // console.log(arr[0] + "-" + time2);
        // categoryData.push(time1 + ":" + time2);
        values.push(arr[1]);
        volumes.push(arr[2] - tmpVolumes);
        tmpVolumes = arr[2];
    }

    // console.log(categoryData.length);
    for (var i = values.length; i < categoryData.length; i++) {
        values.push(null);
        volumes.push(null);
    }
    return {
        categoryData: categoryData,
        values: values,
        volumes: volumes
    };
}
function setmOption() {
    var data = splitData_m(mdata.mdata);    
    //分时图图表配置
    var option = {
        backgroundColor: '#3A3949',
        animation: false,
        legend: {
            show: false,
            bottom: 10,
            left: 'center',
            data: ['MA5']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(50, 50, 50, 0.8)',
            padding: 10,
            textStyle: {
                color: '#ccc'
            },
            position: function (pos, params, el, elRect, size) {
                var obj = { top: 10 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            },
            extraCssText: 'width: 150px'
        },
        axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            show: false,
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        grid: [{
            top: '5%',
            left: '18%',
            right: '8%',
            height: '54%'
        },
        {
            top: '74%',
            left: '18%',
            right: '8%',
            height: '20%'
        }
        ],
        xAxis: [{
            type: 'category',
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            splitNumber: 20,
            axisPointer: {
                z: 100
            },
            axisLabel: {
                interval: function (index, value) {
                    if (value == "09:30") return true;
                    if (value == "10:30") return true;
                    if (value == "11:30") return true;
                    if (value == "14:00") return true;
                    if (value == "15:00") return true;
                    return false;
                },
                formatter: function (value, index) {
                    if (value == "11:30") return "11:30/13:00";
                    return value;
                },
                color: "#fff"
            },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            }
        },
        {
            type: 'category',
            gridIndex: 1,
            data: data.categoryData,
            scale: true,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: false },
            axisLabel:{ show: false },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
                label: {
                    formatter: function (params) {
                        var seriesValue = (params.seriesData[0] || {}).value;
                        return params.value +
                            (seriesValue != null ?
                                '\n' + echarts.format.addCommas(seriesValue) :
                                ''
                            );
                    }
                }
            },
        }
        ],
        yAxis: [{
            scale: true,
            axisLabel: { color: "#fff" },
            splitLine: {
                lineStyle: {
                    color: "#ccc",
                    type: "dashed"
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            }
        },
        {
            scale: true,
            min:0,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { 
                color: "#fff" ,
                formatter: function (params) {
                    if (params/10000>1) {
                        let decimal = params/10000
                        let result = (Math.round(decimal * 100) / 100).toFixed(2) + '万';
                        return result;
                    }else{
                        return params;
                    }
                    
                }
            },
            splitLine: {
                lineStyle: {
                    color: "#ccc"
                }
            },
            axisLine: {
                lineStyle: {
                    color: "#ccc"
                }
            }
        }
        ],
        series: [{
            name: '分时',
            type: 'line',
            data: data.values,
            smooth: true,
            lineStyle: {
                normal: {
                    opacity: 0.6,
                    color: "#d61410"
                }
            },
            areaStyle: {
                normal: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                    offset: 0, color: '#bd2828' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#fff' // 100% 处的颜色
                    }])
                }
            }
        },
        {
            name: '成交量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: data.volumes,
            itemStyle: {
                normal: {
                    opacity: 0.5,
                    color: "#ec0000"
                }
            }
        }
        ]
    };
    return option;
}

//日K
function splitData_k1(rawData) {
    // console.log(rawData);
    var categoryData = [];
    var values = []
    var volumes = []
    for (var i = rawData.length - 30; i < rawData.length; i++) {
        var date = rawData[i].splice(0, 1)[0];
        var tepVolumes = rawData[i].splice(4, 1)[0];
        var dateArr = date.split("-");
        categoryData.push(dateArr[1] + "/" + dateArr[2]);
        values.push(rawData[i])
        volumes.push(tepVolumes)
    }
    return {
        categoryData: categoryData,
        values: values,
        volumes:volumes

    };
}
function setkOption() {
        
        var data0 = splitData_k1(mdata.kdata);
        console.log('data0',data0);
        // console.log(dayData);
        // 指定图表的配置项和数据
        var option_k1 = {
            backgroundColor: '#3A3949',
            legend: {
                show: false,
                bottom: 10,
                left: 'center',
                data: ['日期','开盘价', '收盘价', '最高价', '最低价']
            },
            title: {
                text: '',
                left: 0
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {
                        type: ['lineX', 'clear']
                    }
                }
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            visualMap: {
                show: false,
                seriesIndex: 5,
                dimension: 2,
                pieces: [{
                    value: 1,
                    color: '#ccc'
                }, {
                    value: -1,
                    color: '#ffff00'
                }]
            },
            grid: [{
                top: '5%',
                left: '18%',
                right: '3%',
                height: '54%'
            },
            {
                top: '74%',
                left: '18%',
                right: '3%',
                height: '20%'
            }
            ],
            xAxis: [{
                type: 'category',
                data: data0.categoryData,
                scale: true,
                boundaryGap: true,
                axisLine: { onZero: false },
                splitLine: { show: false },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisLabel: { color: "#fff" },
                axisLine: { lineStyle: {
                    color: "#ccc"
                }},
            },
            {
                type: 'category',
                gridIndex: 1,
                data: data0.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                axisLabel:{ show: false },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    label: {
                        formatter: function (params) {
                            var seriesValue = (params.seriesData[0] || {}).value;
                            return params.value +
                                (seriesValue != null ?
                                    '\n' + echarts.format.addCommas(seriesValue) :
                                    ''
                                );
                        }
                    }
                },
            }],
            yAxis: [{
                scale: true,
                boundaryGap: ["30%", "30%"],
                axisLabel: { color: "#fff" },
                splitLine: { lineStyle: {
                    color: "#ccc",
                    type: "dashed"
                }},
                axisLine: { lineStyle: {
                    color: "#ccc"
                }},
            },
            {
                scale: true,
                min:0,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { 
                    color: "#fff" ,
                    formatter: function (params) {
                        if (params/10000>1) {
                            let decimal = params/10000
                            let result = (Math.round(decimal * 100) / 100).toFixed(2) + '万';
                            return result;
                        }else{
                            return params;
                        }
                        
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#ccc"
                    }
                }
            }],
            series: [{
                name: '日K',
                backgroundColor: 'rgba(50, 50, 50, 0.8)',
                // dimensions: ['日期','开盘价', '收盘价', '最高价', '最低价'],
                type: 'candlestick',
                data: data0.values,
                barMaxWidth: 10,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: upColor,
                        borderColor0: downColor
                    }
                }
            },
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data0.volumes,
                itemStyle: {
                    normal: {
                        opacity: 0.5,
                        color: "#ec0000"
                    }
                }
            }]
        };
    return option_k1;
};


export default {
  install
}
