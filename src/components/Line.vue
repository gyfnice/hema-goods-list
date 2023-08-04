<template>
    <van-space direction="vertical" fill align="center">
        <Line v-if="!saleMode" :data="chartData" :options="chartOptions" />
        <Line v-if="saleMode" :data="saleChartData" :options="chartOptions" />
        <van-button @click="switchSaleMode" size="small" plain type="primary"
            >切换为{{ this.saleMode ? '价格' : '销量' }}趋势</van-button
        >
        <br />
    </van-space>
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import dayjs from 'dayjs';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    name: 'App',
    props: ['list', 'title'],
    components: {
        Line
    },
    mounted() {
        console.log('this.saleMode :>> ', this.saleMode, this.uniqList);
    },
    computed: {
        uniqList() {
            const list = this.list.map((item) => {
                item.day = dayjs(item.timestamp).format('MM-DD');
                return item;
            });
            return _.uniqBy(list, 'day');
        },
        saleChartData() {
            return {
                labels: this.uniqList.map((item) => item.day),
                datasets: [
                    {
                        label: this.title,
                        borderColor: 'red',
                        data: this.uniqList.map((item) => item.month_sell)
                    }
                ]
            };
        },
        chartData() {
            return {
                labels: this.uniqList.map((item) =>
                    dayjs(item.timestamp).format('MM-DD')
                ),
                datasets: [
                    {
                        label: this.title,
                        borderColor: '#1989fa',
                        data: this.uniqList.map((item) => item.price)
                    }
                ]
            };
        }
    },
    methods: {
        switchSaleMode() {
            this.saleMode = !this.saleMode;
        }
    },
    data() {
        return {
            saleMode: false,
            chartOptions: {
                responsive: true,
                layout: {
                    padding: '0 16px'
                },
                scales: {
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: (value, index, ticks) => {
                                if (this.saleMode)
                                    return Number.isInteger(value)
                                        ? value + '件'
                                        : '';
                                return index % 2 === 0
                                    ? '¥' + value.toFixed(2)
                                    : '';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        };
    }
};
</script>
<style lang="less" scoped></style>
