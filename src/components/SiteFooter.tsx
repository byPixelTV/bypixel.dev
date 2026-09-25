import FooterSkills from "@/components/portfolio/FooterSkills";
import FooterFinale from "@/components/portfolio/FooterFinale";
import RollText from "@/components/portfolio/RollText";
import FooterNavLink from "./FooterNavLink";

export default function SiteFooter() {
  return (
    <footer id="contact" className="site-footer footer-clean">
      <FooterFinale>
        <svg
          className="footer-contours"
          viewBox="0 0 1400 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <path
                key={index}
                transform={`translate(${index * -35} ${index * 25})`}
                d="M-100 150C120-80 330 340 550 140S950-100 1200 150 1560 420 1600 200M-100 430C160 200 320 630 620 410S1010 230 1290 490 1500 690 1600 500"
              />
            ))}
          </g>
        </svg>
        <p className="footer-autograph">byPixelTV</p>
        <h2 className="footer-title">
          BUILT OUT OF
          <br />
          <span className="footer-curiosity-line">
            <em>
              <a href="mailto:contact@bypixel.dev" className="footer-hello">
                <RollText>CURIOSITY.</RollText>
              </a>
            </em>
          </span>
        </h2>
        <div className="footer-clean-links">
          <nav aria-label="Footer pages">
            <p className="eyebrow">Explore</p>
            <FooterNavLink href="/">HOME</FooterNavLink>
            <FooterNavLink href="/now">NOW</FooterNavLink>
            <FooterNavLink href="/blog">BLOG</FooterNavLink>
            <a
              href="https://github.com/byPixelTV/bypixel.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RollText>SOURCE ↗</RollText>
            </a>
          </nav>
          <nav aria-label="Footer social links">
            <p className="eyebrow">Elsewhere</p>
            <a href="https://github.com/bypixeltv" target="_blank" rel="noopener noreferrer">
              <RollText>GITHUB ↗</RollText>
            </a>
            <a href="https://discord.gg/yVp7Qvhj9k" target="_blank" rel="noopener noreferrer">
              <RollText>DISCORD ↗</RollText>
            </a>
            <a href="https://twitter.com/bypixeltv" target="_blank" rel="noopener noreferrer">
              <RollText>X / TWITTER ↗</RollText>
            </a>
            <a href="mailto:contact@bypixel.dev">
              <RollText>EMAIL ↗</RollText>
            </a>
          </nav>
        </div>
        <FooterSkills />
      </FooterFinale>
      <div className="footer-baseline">
        <span>© {new Date().getFullYear()} byPixelTV</span>
        <span>Always curious.</span>
      </div>
    </footer>
  );
}
