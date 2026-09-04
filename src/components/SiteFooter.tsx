import Link from "next/link";

import RollText from "@/components/portfolio/RollText";
import LightningStory from "@/components/portfolio/LightningStory";
import Reveal from "@/components/portfolio/Reveal";
import FooterNavLink from "./FooterNavLink";

export default function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <Reveal>
        <div className="footer-stage" data-enter>
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

          <p className="eyebrow footer-signature">
            byPixelTV / Made with curiosity
          </p>

          <h2>
            BUILT OUT OF
            <br />
            <em>
              <Link href="/#projects" className="footer-hello">
                <RollText>CURIOSITY.</RollText>
              </Link>
            </em>
          </h2>

          <p className="footer-about">
            Personal projects, experiments and ideas I choose to explore.
          </p>

          <div className="footer-columns">
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
                <RollText>SOURCE CODE ↗</RollText>
              </a>
            </nav>

            <LightningStory />

            <nav aria-label="Footer social links">
              <p className="eyebrow">Elsewhere</p>

              <a
                href="https://github.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RollText>GITHUB ↗</RollText>
              </a>

              <a
                href="https://discord.gg/yVp7Qvhj9k"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RollText>DISCORD ↗</RollText>
              </a>

              <a
                href="https://twitter.com/bypixeltv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RollText>X / TWITTER ↗</RollText>
              </a>

              <a href="mailto:contact@bypixel.dev">
                <RollText>EMAIL ↗</RollText>
              </a>
            </nav>
          </div>

          <a
            href="https://discord.gg/yVp7Qvhj9k"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact"
          >
            <RollText>Say hi on Discord</RollText>{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="footer-baseline">
          <span>© {new Date().getFullYear()} byPixelTV</span>
          <span>Software developer. Always curious.</span>

          <FooterNavLink href="/">Back to home ↗</FooterNavLink>
        </div>
      </Reveal>
    </footer>
  );
}