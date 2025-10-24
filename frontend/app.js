const apiUrl = 'http://localhost:3000';

new Vue({
    el: '#app',
    data: {
        lessons: [],
        cart: [],
        showCart: false,
        searchQuery: '',
        sortKey: '',
        sortOrder: 'asc',
        order: {
            name: '',
            phone: ''
        }
    },
    created() {
        this.fetchLessons();
    },
    computed: {
        sortedLessons() {
            return this.lessons;
        },
        isFormValid() {
            return /^[A-Za-z\s]+$/.test(this.order.name) && /^[0-9]+$/.test(this.order.phone);
        }
    },
    methods: {
        searchLessons() {
            if (this.searchQuery) {
                fetch(`${apiUrl}/api/search?q=${this.searchQuery}`)
                    .then(response => response.json())
                    .then(data => {
                        this.lessons = data;
                    })
                    .catch(error => {
                        console.error('Error searching lessons:', error);
                    });
            } else {
                this.fetchLessons();
            }
        },
        fetchLessons() {
            let url = `${apiUrl}/api/lessons`;
            if (this.sortKey) {
                url += `?sortBy=${this.sortKey}&order=${this.sortOrder}`;
            }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => {
                    console.error('Error fetching lessons:', error);
                });
        },
        addToCart(lesson) {
            this.cart.push(lesson);
            lesson.spaces--;
        },
        removeFromCart(index) {
            const removedItem = this.cart.splice(index, 1)[0];
            const lesson = this.lessons.find(l => l._id === removedItem._id);
            if (lesson) {
                lesson.spaces++;
            }
        },
        submitOrder() {
            const promises = [];
            this.cart.forEach(item => {
                promises.push(
                    fetch(`${apiUrl}/api/lessons/${item._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ spaces: item.spaces }) // The space is already decremented
                    })
                );
            });

            Promise.all(promises)
                .then(() => {
                    fetch(`${apiUrl}/api/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...this.order, cart: this.cart })
                    })
                    .then(response => {
                        if (!response.ok) { throw new Error('Order submission failed'); }
                        return response.json();
                    })
                    .then(() => {
                        alert('Order submitted successfully!');
                        this.cart = [];
                        this.showCart = false;
                        this.fetchLessons();
                    })
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was a problem submitting your order.');
                });
        }
    }
});
