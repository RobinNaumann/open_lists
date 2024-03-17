import { render } from 'preact';
import './style.scss';
import { Bit } from './bit/bit_state';
import { EntryView } from './view/v_entry';
import { EntryService } from './service/s_entry';
import { CreateView } from './view/v_create';
import { HeaderView } from './view/v_header';
import { FooterView } from './view/v_footer';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { imsg, listId } from './util';


function ListView() {
	const bit = new Bit<any[]>(null, async (d, e) => { return await EntryService.i.observe(listId(), d, e) });

	return bit.map({
		onLoading: () => <Spinner />,
		onError: (e) => <div class="padded"><AlertTriangle class="margined" /></div>,
		onData: (data) => {
			return (
				<div class="list-base">
					{data.length === 0 ? (
						<div class="empty-list-message">{imsg({ "de": "Die Liste ist leer", "en": "this list is empty" })}</div>
					) : (
						data.map((entry) => {
							console.log(entry);
							return <EntryView entry={entry} />;
						}))}
					<CreateView />
				</div>

			);
		}

	});
}

function App() {

	const isHome = listId() == null;

	return (
		<div class="content-base">
			<HeaderView />
			{isHome
				? (<div style="margin: 4rem 0" class="padded">create a new list</div>)
				: (<ListView />)}
			<FooterView />
		</div>
	);
}

function Spinner() {
	return <div style="margin: 5rem 0" class="padded rotate-box"><Loader2 /></div>;
}

render(<App />, document.getElementById('app'));
