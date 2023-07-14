import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';

interface Item {
  name: string;
  value: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectCallback,
  defalutItem,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectItem, setSelectItem] = useState<Item>(
    defalutItem ? defalutItem : items[0]
  );
  const ref = useDetectClickOutside({
    onTriggered: () => setOpenDropdown(false),
  });

  useEffect(() => {
    console.log(defalutItem);
  }, []);

  useEffect(() => {
    selectCallback(selectItem.value);
  }, [selectItem]);

  return (
    <>
      <div
        ref={ref}
        className='relative inline-block h-12 w-full rounded-[10px] border border-gray-300 lg:block'
      >
        <div
          className='flex h-full flex-row justify-between rounded-md border px-3 py-1.5'
          onClick={() => {
            if (!openDropdown) setOpenDropdown(true);
            else setOpenDropdown(false);
          }}
        >
          <div className='flx-row flex items-center'>
            <span>{selectItem.name}</span>
          </div>
          <div className='flex items-center'>
            <i
              className={`fas fa-caret-up mr-1 ${
                openDropdown ? 'rotate-180' : ''
              }`}
              style={{
                transition: 'all 0.3s',
              }}
            />
          </div>
        </div>
        <div
          className={`absolute z-10 mt-1 max-h-[200px] min-h-[40px] w-full overflow-y-auto rounded-md border bg-white ${
            openDropdown ? 'visible' : 'invisible'
          }`}
          style={{
            transition: 'all 0.3s',
            transform: openDropdown ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
          }}
        >
          {items.map((item, index) => (
            <button
              onClick={() => {
                setOpenDropdown(false);
                setSelectItem(item);
              }}
              key={index}
              className={`w-full px-3 py-1.5 hover:bg-gray-100 ${
                index === 0 && 'rounded-t-md'
              } ${index == items.length - 1 && 'rounded-b-md'}`}
            >
              <div className='flex w-full flex-row items-center justify-between'>
                <div className='flex flex-row items-center'>{item.name}</div>
                <div>
                  {selectItem.value == item.value && (
                    <i className='fas fa-check text-schoolmate-500 mr-1' />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

interface DropdownProps {
  items: Item[];
  defalutItem?: Item;
  selectCallback: (id: string) => void;
}
export default Dropdown;
