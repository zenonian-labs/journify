import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { CheckIn, Discovery, Place, Search, User } from './components';
import { showDetailPlaceModal } from './modal';

import type { PlaceData } from '@/types';
import { useAuth } from '@/utils/auth';
import { inspectCheckInCount, useLocation, usePlaces } from '@/utils/map';

export const Map = () => {
	const { user } = useAuth();
	const { region } = useLocation();
	const { places, checkIns } = usePlaces();
	const { top } = useSafeAreaInsets();
	const currentPlace = places[0];
	const navigation = useNavigation();
	const searchBarStyle = { ...styles.searchBar, top };

	const handlePressPlace = (place: PlaceData) => {
		showDetailPlaceModal(
			place,
			checkIns.filter((c) => c.placeId === place.id),
		);
	};

	const handlePressCheckIn = () => {
		navigation.navigate('Checkin' as never);
	};

	return (
		<View style={styles.container}>
			<MapView
				style={styles.mapContainer}
				initialRegion={region}
				region={region}
			>
				{places.map((p) => {
					const { color, value } = inspectCheckInCount(p);
					const handlePress = () => handlePressPlace(p);
					return (
						<Place
							key={p.id}
							title={p.name}
							location={p.location}
							image={{ uri: p.imageUrl }}
							tagText={value}
							tagColor={color}
							onPress={handlePress}
						/>
					);
				})}
				<User location={region} imageUrl={user?.photoURL as string} />
			</MapView>
			<View style={searchBarStyle}>
				<Search />
			</View>

			{currentPlace ? (
				<CheckIn
					style={styles.bottomView}
					place={currentPlace}
					onPressPlace={handlePressPlace}
					onPressCheckIn={handlePressCheckIn}
				/>
			) : (
				<Discovery style={styles.bottomView} />
			)}
		</View>
	);
};

export default Map;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchBar: {
		position: 'absolute',
		left: 0,
		right: 0,
		paddingHorizontal: 14,
	},
	mapContainer: {
		flex: 1,
	},
	bottomView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 14,
		paddingTop: 16,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		shadowOffset: {
			height: -1,
			width: 0,
		},
		shadowOpacity: 0.2,
	},
});
