import styled from "styled-components";

export const Box = styled.div`
  width: calc(100% - 70px);
  position: relative;
  background-color: #F8FAFC;
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: left;
  background-size: cover;

  ${({ $isHome }) => $isHome && `
    background-image: var(--img-00);
  `}

  background: ${({ $bgColor }) => $bgColor && `
    linear-gradient(90deg, #${$bgColor.Cor1} 0%, #${$bgColor.Cor2} 100%)
  `};

  ${({ $bgImg }) => $bgImg && `
    background-image: var(${$bgImg});
    background-position: center;
  `}


  ${({ $isHome, $bgColor, $bgImg }) => ($isHome || $bgColor || $bgImg) && `
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(27, 48, 72, 0.1); /* Cor preta semitransparente */
      z-index: 0;
    }
  `}

  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

export const Img = styled.div``;