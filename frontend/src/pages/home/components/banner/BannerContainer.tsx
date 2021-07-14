import BannerView from './BannerView';

type props = {
  children?: JSX.Element;
};
export default function BannerContainer(props: props) {
  return <BannerView>{props.children}</BannerView>;
}
