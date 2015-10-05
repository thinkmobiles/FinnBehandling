app.directive('gmap', function () {
    return {
        restrict: "A",
        scope: {
            latitude: "=",
            longitude: "=",
            address: "=",
            result: "="
        },
        template: "<div id='map-canvas'  style='height: 400px; width: 600px; border-radius: 6px'></div>",
        link: function (scope, elem, attr) {

            if (attr.result) {
                var myLatlng = new google.maps.LatLng(40, 0);
                var mapOptions = {
                    zoom: 1,
                    center: myLatlng,
                    scrollwheel: true,
                    navigationControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                    draggable: true
                };

                var geocoder = new google.maps.Geocoder();
                var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

                google.maps.event.addListener(map, 'click', function (event) {
                    if (scope.marker instanceof google.maps.Marker) {
                        scope.marker.setMap(null);
                    }

                    scope.marker = new google.maps.Marker({
                        position: event.latLng,
                        map: map
                    });

                    map.setCenter(event.latLng);

                    scope.latitude = event.latLng.A;
                    scope.longitude = event.latLng.F;

                    geocoder.geocode({
                        latLng: event.latLng
                    }, function (responses) {
                        var responsesIsExists = responses && responses.length;
                        var resultOptions = {
                            latitude: scope.latitude,
                            longitude: scope.longitude
                        };

                        resultOptions.address = responsesIsExists ? responses[0].formatted_address : '';

                        if (scope.result) {
                            scope.result(resultOptions);
                            scope.$apply();
                        }
                    });
                });
            }


            if (attr.address) {
                scope.$watch('address', function () {
                    geocoder.geocode({
                            address: scope.address,
                            region: 'no'
                        },
                        function (results, status) {
                            if (status.toLowerCase() == 'ok') {
                                if (scope.marker instanceof google.maps.Marker) {
                                    scope.marker.setMap(null);
                                }

                                var coords = new google.maps.LatLng(
                                    results[0]['geometry']['location'].lat(),
                                    results[0]['geometry']['location'].lng()
                                );

                                map.setCenter(coords);

                                if (scope.result) {
                                    scope.result({
                                        latitude: results[0]['geometry']['location'].lat(),
                                        longitude: results[0]['geometry']['location'].lng()
                                    });
                                    scope.$apply();
                                }

                                map.setCenter(coords);

                                scope.marker = new google.maps.Marker({
                                    position: coords,
                                    map: map
                                });
                            }
                        }
                    );
                });
            }

            if (attr.latitude && attr.longitude) {
                scope.$watchGroup(['latitude', 'longitude'], function () {
                    var myLatlng = new google.maps.LatLng(scope.latitude, scope.longitude);
                    var mapOptions = {
                        zoom: 6,
                        center: myLatlng,
                        scrollwheel: true,
                        navigationControl: true,
                        mapTypeControl: false,
                        scaleControl: false,
                        draggable: true
                    };

                    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map
                    });

                    marker.setMap(map);
                });
            }
        }
    }
});