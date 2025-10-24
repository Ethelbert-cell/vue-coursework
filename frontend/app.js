const apiUrl = 'http://localhost:3000';

new Vue({
    el: '#app',
    data: {
        lessons: [],
        cart: [],
        showCart: false,
        searchQuery: '',
        sortKey: 'subject',
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
        isFormValid() {
            return /^[A-Za-z\s]+$/.test(this.order.name) && /^[0-9]+$/.test(this.order.phone);
        }
    },
    methods: {
        fetchLessons() {
            let url = `${apiUrl}/api/lessons?sortBy=${this.sortKey}&order=${this.sortOrder}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => console.error('Error fetching lessons:', error));
        },
        searchLessons() {
            if (this.searchQuery) {
                fetch(`${apiUrl}/api/search?q=${this.searchQuery}`)
                    .then(response => response.json())
                    .then(data => {
                        this.lessons = data;
                    })
                    .catch(error => console.error('Error searching lessons:', error));
            } else {
                this.fetchLessons();
            }
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
            const lessonIDs = this.cart.map(item => item._id);
            const numberOfSpaces = this.cart.length;

            const orderData = {
                ...this.order,
                lessonIDs,
                numberOfSpaces
            };

            const promises = this.cart.map(item => {
                return fetch(`${apiUrl}/api/lesson/${item._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ spaces: item.spaces })
                });
            });

            Promise.all(promises)
                .then(() => {
                    return fetch(`${apiUrl}/api/order`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });
                })
                .then(response => {
                    if (!response.ok) { throw new Error('Order submission failed'); }
                    return response.json();
                })
                .then(() => {
                    alert('Order submitted successfully!');
                    this.cart = [];
                    this.showCart = false;
                    this.fetchLessons(); // Refetch to show updated spaces
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was a problem submitting your order.');
                });
        }
    }
});
