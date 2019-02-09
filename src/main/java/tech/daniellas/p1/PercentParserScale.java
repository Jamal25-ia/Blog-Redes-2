package tech.daniellas.p1;

import static java.math.BigDecimal.ZERO;
import static tech.daniellas.p1.Composition3.applySafe;
import static tech.daniellas.p1.Composition3.hundredMultiplier;
import static tech.daniellas.p1.Composition3.percentAppender;

import java.util.function.Function;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.junit.Test;

public class PercentParserScale {

	// This parser combines trimming and scaling functionality
	Function<String, String> parser = applySafe(NumberUtils::createBigDecimal, ZERO)
	    .andThen(hundredMultiplier)
	    // Here we apply scaling function
	    .andThen(NumberUtils::toScaledBigDecimal)
	    .andThen(percentAppender)
	    .compose(StringUtils::trim);

	@Test
	public void test() {
		// Prints '55.50 %'
		System.out.println(parser.apply(" 0.555 "));

		// Prints '0.00 %'
		System.out.println(parser.apply(" x "));
	}

	// Here we use scaling via hundredMultiplier and toSclaedBigDecimal composition
	Function<String, String> otherParser = applySafe(NumberUtils::createBigDecimal, ZERO)
	    // Here we apply multiplying and then scaling functions
	    .andThen(hundredMultiplier
	        .andThen(NumberUtils::toScaledBigDecimal))
	    .andThen(percentAppender)
	    .compose(StringUtils::trim);

	@Test
	public void testOther() {
		// Prints '55.50 %'
		System.out.println(otherParser.apply(" 0.555 "));

		// Prints '0.00 %'
		System.out.println(otherParser.apply(" x "));
	}

}
