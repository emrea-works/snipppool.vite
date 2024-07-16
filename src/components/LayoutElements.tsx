import { Stack } from 'react-bootstrap';
import { Scissors } from 'react-bootstrap-icons';

export const Header = () => {
  return (
		<Stack direction="horizontal" className="mb-3">
			<div><Scissors size={12} style={{transform: "rotate( 90deg)"}} /></div>
			<div className="mx-auto justify-content-center ">
				<h1 className="m-0">sniPPPool</h1>
			</div>
			<div><Scissors size={12} style={{transform: "rotate(-90deg)"}} /></div>
		</Stack>
	);
};

export const Footer = () => {
  return (<div className="w-full self-end">
    <div className="w-full border-t text-center bg-gray-700">...</div>
  </div>);
};
