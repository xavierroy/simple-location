jQuery( document ).ready( function( $ ) {

	function lookupLocation() {
		var options = {
			enableHighAccuracy: true,
			maximumAge: 600000
		};
		if ( 'HTML5' === geo_options.lookup ) { // eslint-disable-line camelcase
			if ( navigator.geolocation ) {
			navigator.geolocation.getCurrentPosition( reverseLookup, error, options );
			} else {
				alert( 'Geolocation is not supported by this browser.' );
			}
		} else {
			getCurrentPosition();
		}
	}

	function getCurrentPosition( ) {
		var position;
		$.ajax({
				type: 'GET',

				// Here we supply the endpoint url, as opposed to the action in the data object with the admin-ajax method
				url: sloc.api_url + 'lookup/',
				beforeSend: function( xhr ) {

					// Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
					xhr.setRequestHeader( 'X-WP-Nonce', sloc.api_nonce );
				},
				data: {
					user: $( '#post_author_override' ).val()
				},
				success: function( response ) {
					if ( 'undefined' == typeof response ) {
						return null;
					} else {
						position =  {timestamp: ( new Date() ).getTime(), coords: response};
						reverseLookup( position );
					}

				},
				error: function( request, status, error ) {
					alert( request.responseText );
				}
			});

	}

	function reverseLookup( position ) {
		if ( '' === $( '#longitude' ).val() ) {
			$( '#longitude' ).val( position.coords.longitude ) ;
		}
		if ( '' === $( '#latitude' ).val() ) {
			$( '#latitude' ).val( position.coords.latitude ) ;
		}
		$( '#accuracy' ).val( position.coords.accuracy );
		$( '#heading' ).val( position.coords.heading );
		$( '#speed' ).val( position.coords.speed );
		$( '#altitude' ).val( position.coords.altitude );
		$( '#map_zoom' ).val( parseInt( Math.log2( 591657550.5 / ( position.coords.accuracy * 45 ) ) ) + 1 );
		$.ajax({
				type: 'GET',

				// Here we supply the endpoint url, as opposed to the action in the data object with the admin-ajax method
				url: sloc.api_url + 'geocode/',
				beforeSend: function( xhr ) {

					// Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
					xhr.setRequestHeader( 'X-WP-Nonce', sloc.api_nonce );
				},
				data: {
					latitude: $( '#latitude' ).val(),
					longitude: $( '#longitude' ).val(),
					altitude: $( '#altitude' ).val(),
					weather: true,
					map_zoom: $( '#map_zoom' ).val() // eslint-disable-line camelcase
				},
				success: function( response ) {
					if ( 'undefined' == typeof response ) {
					} else {
						if ( ( 'display-name' in response ) && ( '' === $( '#address' ).val() ) ) {
							$( '#address' ).val( response['display-name']) ;
						}
						if ( 'name' in response ) {
							$( '#location-name' ).val( response.name ) ;
						}
						if ( 'latitude' in response  && ( '' === $( '#latitude' ).val() ) ) {
							$( '#latitude' ).val( response.latitude ) ;
						}
						if ( 'longitude' in response  && ( '' === $( '#longitude' ).val() ) ) {
							$( '#longitude' ).val( response.longitude ) ;
						}
						if ( 'altitude' in response && ( '' === $( '#altitude' ).val() ) ) {
							$( '#altitude' ).val( response.altitude ) ;
						}

						if ( 'street-address' in response ) {
							$( '#street-address' ).val( response['street-address']) ;

						}
						if ( 'extended-address' in response ) {
							$( '#extended-address' ).val( response['extended-address']) ;
						}
						if ( 'locality' in response ) {
							$( '#locality' ).val( response.locality ) ;
						}
						if ( 'region' in response ) {
							$( '#region' ).val( response.region ) ;
						}
						if ( 'postal-code' in response ) {
							$( '#postal-code' ).val( response['postal-code']) ;
						}
						if ( 'country-name' in response ) {
							$( '#country-name' ).val( response['country-name']) ;
						}
						if ( 'country-code' in response ) {
							$( '#country-code' ).val( response['country-code']) ;
						}
						if ( 'timezone' in response ) {
							$( '#post-timezone' ).val( response.timezone ) ;
							$( '#post-timezone-label' ).text( response.timezone );
						}
						if ( 'weather' in response ) {
							weather = response.weather;
							if ( ( 'temperature' in weather ) && ( '' === $( '#temperature' ).val() ) ) {
								$( '#temperature' ).val( weather.temperature ) ;
							}
							if ( ( 'humidity' in weather ) && ( '' === $( '#humidity' ).val() ) ) {
								$( '#humidity' ).val( weather.humidity ) ;
							}
							if ( ( 'icon' in weather ) && ( 'none' === $( '#weather_icon' ).val() ) ) {
								$( '#weather_icon' ).val( weather.icon ).change() ;
							}
							if ( ( 'summary' in weather ) && ( '' === $( '#weather_summary' ).val() ) ) {
								$( '#weather_summary' ).val( weather.summary ) ;
							}
							if ( ( 'pressure' in weather ) && ( '' === $( '#pressure' ).val() ) ) {
								$( '#pressure' ).val( weather.pressure ) ;
							}
							if ( ( 'visibility' in weather ) && ( '' === $( '#visibility' ).val() ) ) {
								$( '#visibility' ).val( weather.visibility ) ;
							}
								if ( 'wind' in weather ) {
									if ( 'speed' in weather.wind ) {
										$( '#wind_speed' ).val( weather.wind.speed ) ;
									}
								if ( 'degree' in weather.wind ) {
									$( '#wind_degree' ).val( weather.wind.degree ) ;
								}
							}
							if ( 'units' in weather ) {
								$( '#units' ).val( weather.units ) ;
							}
						}

						if ( window.console ) {
							console.log( response );
						}
					}
				},
				error: function( request, status, error ) {
					alert( request.responseText );
				},
				always: hideLoadingSpinner()
			});
	}

	function clearLocation() {
		var fieldIds = [
			'latitude',
			'longitude',
			'altitude',
			'map_zoom',
			'street-address',
			'extended-address',
			'locality',
			'region',
			'postal-code',
			'country-name',
			'country-code',
			'address',
			'location-name',
			'temperature',
			'humidity',
			'speed',
			'heading',
			'weather_summary',
			'weather_icon',
			'wind_speed',
			'wind_degree',
			'visibility',
			'pressure'

		];
		if ( ! confirm( 'Are you sure you want to remove the location details?' ) ) {
			return;
		}
		$.each( fieldIds, function( count, val ) {
			document.getElementById( val ).value = '';
		});
	}

	function showLoadingSpinner() {
		$( '#locationbox-meta' ).addClass( 'is-loading' );
	}

	function hideLoadingSpinner() {
		$( '#locationbox-meta' ).removeClass( 'is-loading' );
	}

	function error( err ) {
		alert( err.message );
	}


	$( document )
		.on( 'click', '.lookup-address-button', function( event ) {
			showLoadingSpinner();
			lookupLocation();
			event.preventDefault();
		})
		.on( 'click', '.clear-location-button', function( event ) {
			clearLocation();
			event.preventDefault();
		})
		.on( 'click', '.save-venue-button', function() {
			$.ajax({
				type: 'POST',

				// Here we supply the endpoint url, as opposed to the action in the data object with the admin-ajax method
				url: sloc.api_url + 'reverse/',
				beforeSend: function( xhr ) {

					// Here we set a header 'X-WP-Nonce' with the nonce as opposed to the nonce in the data object with admin-ajax
					xhr.setRequestHeader( 'X-WP-Nonce', sloc.api_nonce );
				},
				data: {
					action: 'save_venue_data',
					latitude: $( '#latitude' ).val(),
					longitude: $( '#longitude' ).val(),
					location_name: $( '#location-name' ).val(), // eslint-disable-line camelcase
					street_address: $( '#street-address' ).val(), // eslint-disable-line camelcase
					extended_address: $( '#extended-address' ).val(), // eslint-disable-line camelcase
					locality: $( '#locality' ).val(),
					region: $( '#region' ).val(),
					postal_code: $( '#postal-code' ).val(), // eslint-disable-line camelcase
					country_name: $( '#country-name' ).val(), // eslint-disable-line camelcase
					country_code: $( '#country-code' ).val() // eslint-disable-line camelcase
				},
				success: function( response ) {
					if ( 'undefined' !== typeof response ) {
						if ( 'undefined' !== typeof response ) {
						}
					}
					console.log( response );
				},
				error: function( request, status, error ) {
					alert( request.responseText );
				}
			});
	});

	$postTimezoneSelect = $( '#post-timezone-select' );
	$locationDetail = $( '#location-details' );
	$TimezoneDetail = $( '#timezone-browser' );

	$postTimezoneSelect.siblings( 'a.edit-post-timezone' ).click( function( event ) {
		if ( $postTimezoneSelect.is( ':hidden' ) ) {
			$postTimezoneSelect.slideDown( 'fast', function() {
				$postTimezoneSelect.find( 'select' ).focus();
			});
			$( this ).hide();
		}
		event.preventDefault();
	});

	$postTimezoneSelect.find( '.save-post-timezone' ).click( function( event ) {
		$postTimezoneSelect.slideUp( 'fast' ).siblings( 'a.edit-post-timezone' ).show().focus();
		$( '#post-timezone-label' ).text( $( '#post-timezone' ).val() );
		event.preventDefault();
	});

	$postTimezoneSelect.find( '.cancel-post-timezone' ).click( function( event ) {
		$postTimezoneSelect.slideUp( 'fast' ).siblings( 'a.edit-post-timezone' ).show().focus();
		$( '#post_timezone' ).val( $( '#hidden_post_timezone' ).val() );
		event.preventDefault();
	});

	$TimezoneDetail.click( function( event ) {
		$( '#post-timezone' ).val( jstz.determine().name() );
		$( '#post-timezone-label' ).text( jstz.determine().name() );
		event.preventDefault();
	});


	$postLocationSelect = $( '#post-location-select' );
	$LocationDetail = $( '#location-lookup' );

	$postLocationSelect.siblings( 'a.edit-post-location' ).click( function( event ) {
		if ( $postLocationSelect.is( ':hidden' ) ) {
			$postLocationSelect.slideDown( 'fast', function() {
				$postLocationSelect.find( 'select' ).focus();
			});
			$( this ).hide();
		}
		event.preventDefault();
	});

	$postLocationSelect.find( '.save-post-location' ).click( function( event ) {
		$postLocationSelect.slideUp( 'fast' ).siblings( 'a.edit-post-location' ).show().focus();
		$( '#post-location-label' ).text( geo_public_options[$( '#post-location' ).val()]); // eslint-disable-line camelcase
		event.preventDefault();
	});

	$postLocationSelect.find( '.cancel-post-location' ).click( function( event ) {
		$postLocationSelect.slideUp( 'fast' ).siblings( 'a.edit-post-location' ).show().focus();
		$( '#post_location' ).val( $( '#hidden_post_location' ).val() );
		event.preventDefault();
	});


	$( 'a.show-location-details' ).click( function( event ) {
		if ( $locationDetail.is( ':hidden' ) ) {
			$locationDetail.slideDown( 'fast' ).siblings( 'a.hide-location-details' ).show().focus();
		} else {
			$locationDetail.slideUp( 'fast' ).siblings( 'a.show-location-details' ).focus();
		}
		event.preventDefault();
	});

	$LocationDetail.click( function( event ) {
		showLoadingSpinner();
		getFullLocation();
		event.preventDefault();
	});
});
