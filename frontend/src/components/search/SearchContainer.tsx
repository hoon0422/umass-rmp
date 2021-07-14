import SearchView from './SearchView';

type props = {
  containedInHeader: boolean;
};

export default function SearchContainer({
  containedInHeader: isHeader,
}: props) {
  return <SearchView isHeader={isHeader} />;
}
