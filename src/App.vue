<template>
    <div class="container">
        <div class="carousel" ref="carousel">
            <transition-group tag="div" :name="transitionName" class="showcase">
                <template v-for="(img, index) in images" :key="img.id">
                    <img v-show="index === currentIndex" :src="img.src" class="showcase__item">
                </template>
            </transition-group>
            <div class="pagination">
                <button class="pagination__left" @click="setIndex(currentIndex - 1)">←</button>
                <div class="pagination__num">
                    <button v-for="(img, index) in images" :key="index" @click="setIndex(index)">{{ index + 1 }}</button>
                </div>
                <button class="pagination__right" @click="setIndex(currentIndex + 1)">→</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Hammer from 'hammerjs';
import data from '@/data.json';

export default {
    name: 'App',
    setup () {
        const images = ref(data);
        const currentIndex = ref(0);
        const transitionName = ref('right-in');
        const carousel = ref(null);
        let timer = null;
        const setIndex = index => {
            transitionName.value = index > currentIndex.value ? 'right-in' : 'left-in';
            currentIndex.value = index > images.value.length - 1 ? 0 : index < 0 ? images.value.length - 1 : index;
        };
        const autoPlay = () => {
            if (timer) return;
            timer = setInterval(() => {
                setIndex(currentIndex.value + 1);
            }, 2000);
        };
        const stopPlay = () => {
            clearInterval(timer);
            timer = null;
        };
        const visibilityChangeHandler = () => {
            if (document.visibilityState === 'hidden') {
                stopPlay();
            }
            else if (document.visibilityState === 'visible') {
                autoPlay();
            }
        };
        onMounted(() => {
            autoPlay();
            carousel.value.addEventListener('mouseenter', stopPlay);
            carousel.value.addEventListener('mouseleave', autoPlay);
            document.querySelectorAll('img').forEach(el => {
                el.addEventListener('dragstart', () => {
                    event.preventDefault();
                });
            });
            document.addEventListener('visibilitychange', visibilityChangeHandler);

            // init swipe event
            const mc = new Hammer(carousel.value);
            mc.on('swipeleft swiperight', ev => {
                if (ev.type === 'swipeleft') {
                    setIndex(currentIndex.value + 1);
                }
                else {
                    setIndex(currentIndex.value - 1);
                }
            });
        });
        onBeforeUnmount(() => {
            carousel.value.removeEventListener('mouseenter', stopPlay);
            carousel.value.removeEventListener('mouseleave', autoPlay);
        });

        return {
            images,
            currentIndex,
            transitionName,
            setIndex,
            carousel
        };
    }
};
</script>

<style lang="scss">
* {
    margin: 0;
}
img {
    vertical-align: middle;
}
.container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 350px;
    height: 200px;
}
.carousel {
    height: 100%;
}
.showcase {
    position: relative;
    overflow: hidden;
    height: 100%;
    &__item {
        position: absolute;
        top: 0;
        left: 0;
    }
}
.pagination {
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    &__num {
        display: flex;
        margin: 0 .5rem;
    }
}
.right-in-enter-from {
    left: 100%;
}
.left-in-enter-from {
    left: -100%;
}
.right-in-enter-active,
.right-in-leave-active,
.left-in-enter-active,
.left-in-leave-active {
    transition: left .5s;
}
.right-in-leave-to {
    left: -100%;
}
.left-in-leave-to {
    left: 100%;
}
</style>
