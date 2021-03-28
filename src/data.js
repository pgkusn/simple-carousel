import { computed } from 'vue';

export default () => {
    const images = computed(() => ([
        { src: 'images/pic1.png' },
        { src: 'images/pic2.png' },
        { src: 'images/pic3.png' },
        { src: 'images/pic4.png' }
    ]));
    return images;
};