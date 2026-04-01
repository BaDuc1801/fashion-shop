import { render } from '@testing-library/react';

import FashionMonorepoShared from './shared';

describe('FashionMonorepoShared', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FashionMonorepoShared />);
    expect(baseElement).toBeTruthy();
  });
});
