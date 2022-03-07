// import React from 'react';
// import styled from 'styled-components';
// import { PropTypes as T } from 'prop-types';

// import { validateRangeNum } from '../../utils/utils';

// import {
//   FormFieldset,
//   FormFieldsetHeader,
//   FormFieldsetBody
// } from '../../styles/form/fieldset';
// import FormLegend from '../../styles/form/legend';
// import StressedFormGroupInput from '../common/stressed-form-group-input';

// const FormFieldsetCompact = styled(FormFieldset)`
//   background: none;
//   border: none;
//   margin: 0;

//   ${FormFieldsetHeader} {
//     padding-left: 1rem;
//     padding-right: 1rem;
//   }

//   ${FormFieldsetBody} {
//     padding: 1rem;
//   }
// `;

// const FormFieldsetBodyColumns = styled(FormFieldsetBody)`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   grid-gap: 1rem;
// `;

// export default function BoundsFieldset (props) {
//   const validateLon = validateRangeNum(-180, 180);
//   const validateLat = validateRangeNum(-90, 90);

//   const {
//     id,
//     title,
//     placeholders,
//     value,
//     onChange
//   } = props;

//   return (
//     <FormFieldsetCompact>
//       <FormFieldsetHeader>
//         <FormLegend>{title}</FormLegend>
//       </FormFieldsetHeader>
//       <FormFieldsetBodyColumns>
//         <StressedFormGroupInput
//           inputType='text'
//           inputSize='small'
//           id={`${id}-lon`}
//           name={`${id}-lon`}
//           label='Longitude'
//           value={value[0] === undefined ? '' : value[0]}
//           validate={validateLon}
//           onChange={(v) => onChange([Number(v), value[1]])}
//           placeholder={placeholders[0]}
//         />
//         <StressedFormGroupInput
//           inputType='text'
//           inputSize='small'
//           id={`${id}-lat`}
//           name={`${id}-lat`}
//           label='Latitude'
//           value={value[1] === undefined ? '' : value[1]}
//           validate={validateLat}
//           onChange={(v) => onChange([value[0], Number(v)])}
//           placeholder={placeholders[1]}
//         />
//       </FormFieldsetBodyColumns>
//     </FormFieldsetCompact>
//   );
// }

// BoundsFieldset.propTypes = {
//   id: T.string,
//   title: T.string,
//   placeholders: T.array,
//   value: T.array,
//   onChange: T.func
// };
