import { render } from 'preact';
import './style.css';
import { Bit } from './bit/bit_state';
import { EntryView } from './view/v_entry';
import { EntryService } from './service/s_entry';
import { CreateView } from './view/v_create';
import { HeaderView } from './view/v_header';


function ListView() {
	const bit = new Bit(null,EntryService.i.observe);

	return bit.map({
		onLoading: () => <Spinner />,
		onError: (e) => <div style={{ backgroundColor: 'red', width: '100px', height: '100px' }}></div>,
		onData: (data) => {
			return (
				<div class="list-base">
					{data.map((entry) => {
						return <EntryView entry={entry} />;
					})}
					<CreateView/>
				</div>
				
			);
		}
	});
}

function App() {
	return (
		<div class="content-base">
			<HeaderView />
			<ListView />
		</div>
	);
}

function Spinner() {
	return <div>Loading...</div>;
}

render(<App />, document.getElementById('app'));
