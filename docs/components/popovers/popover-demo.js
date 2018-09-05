if (document.getElementById('vue-popoverDemo')) {
    const POSITIONS = [
        { label: 'Top Start', value: 'top-start' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top', value: 'top' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top End', value: 'top-end' },
        { label: 'Right Start', value: 'right-start' },
        { label: 'Right Top', value: 'right-top' },
        { label: 'Right', value: 'right' },
        { label: 'Right Bottom', value: 'right-bottom' },
        { label: 'Right End', value: 'right-end' },
        { label: 'Bottom End', value: 'bottom-end' },
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom', value: 'bottom' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Start', value: 'bottom-start' },
        { label: 'Left End', value: 'left-end' },
        { label: 'Left Bottom', value: 'left-bottom' },
        { label: 'Left', value: 'left' },
        { label: 'Left Top', value: 'left-top' },
        { label: 'Left Start', value: 'left-start' },
    ];

    new Vue({
        el: '#vue-popoverDemo',
        data: {
            position: POSITIONS[11],
            positions: POSITIONS,
        },
    });
}
