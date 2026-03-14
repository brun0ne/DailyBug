import { Bug } from "./db";

export const templates = {
	javascript: [
		`
/* add two numbers */
const add $vanish:=$ (var1, var2$vanish:)$ => {
	$vanish:return $var1 $rand_op:+$ var2;
}

$typo:add$(1, $rand_num:3$); // returns: 4
	`,
	`
const insertionSort = (arr) => {
	// Start from the second element
	// (assuming first element is sorted)
	for (let i = 1; i < arr.length; i++) {
		const key = arr[i];
		let j = i $rand_op:-$ 1;

		// Move elements of sorted part
		// greater than key to the right
		$typo:while$ (j >$vanish:=$ 0 && arr[j] > key) {
			arr[j + $rand_num:1$] = arr[j];
			j--;
		}

		// Insert key at its correct
		// position in sorted part
		arr[j $rand_op:+$ 1] = key;
	}

	return arr;
};

const unsortedArray = [5, 2, 8, 1, 3];
const sortedArray = insertionSort(unsortedArray);
// [1, 2, 3, 5, 8]
		`,
		`
function rgbToRgba(rgb, alpha) {
	// Check if input is valid RGB format
	// (3 comma-separated integers)
	const rgbaMatch = rgb.match(/$typo:\d+,\s?\d+,\s?\d+$/);
	if (!rgbaMatch) {
		throw new Error("Invalid RGB format.");
	}

	// Extract individual RGB values
	const [r, g, b] = rgbaMatch$vanish:[0]$.split("$vanish:,$").map($vanish:Number$);

	// Check if alpha is a valid number between 0 and 1
	if (alpha < $rand_num:0$ || alpha $rand_op:>$ 1) {
		throw new Error("Alpha value must be between 0 and 1.");
	}

	return \`rgba(\${r}, \${g}, \${b}, \${alpha.toFixed(2)})\`;
}

rgbToRgba("rgb(100, 100, 100)", 0.8);
// "rgba(100, 100, 100, 0.80)" 
		`,
		`
$vanish:class $Flat {
	constructor ($vanish:price$) {
		$vanish:this.$price = price;
	}
};

class Block {
	constructor (size) {
		this.flats$vanish: = []$;
		for (let i = $rand_num:0$; i < size; i++) {
			const price = Math.floor(Math.random() * 100);
			this.flats.push($vanish:new $Flat(price));
		}
	}
	
	printData () {
		for (const flat of this.flats) {
			console.log($vanish:flat.$price);
		}    
	}
}

const block = new Block(6);
block.printData$vanish:()$;

// Example output:
// 76
// 79
// 67
// 75
// 69
// 68
		`,
		`
const randomMeow = $vanish:() => $(
	"M" $rand_op:+$
	"e".repeat(Math.floor(Math.random() * 5) + 1) +
	"$vanish:o$".repeat(Math.floor(Math.random() * 5) + 1) +
	"w"
);

console.log(randomMeow$vanish:()$);
// Example output: Meeeeeoow
		`
	],
	typescript: [
		`
/* add two numbers */
const add = (var1: $rand_type:number$, var2: number): number => {
	return $typo:var1$ $rand_op:+$ $typo:var2$;
}

$typo:add$(1$vanish:,$ 3);
		`,
		`
/* "Hello" -> "Hehho" (or a similar mutation) */
function replaceRandomLetter(str: $rand_type:string$): string {
	const length = str.length;

	// Check if string is empty
	if ($typo:length$ === 0) {
		return str;
	}

	const randomIndex = Math.floor(
		Math.random$vanish:()$ $rand_op:*$ length
	);

	// Generate a random letter
	// between 'a' and 'z' or 'A' and 'Z'
	$vanish:const $randomLetter = String.fromCharCode(
		Math.floor(Math.random() $rand_op:*$ $rand_num:26$) +
			(Math.random() < 0.5 ? 65 $vanish::$ 97)
	);

	return str.substring(0, randomIndex$vanish:)$ +
		randomLetter $rand_op:+$
		str.substring(randomIndex + 1);
}
	`,
	`
import path from 'path';
import { readFileSync } from '$typo:fs$';

export default $vanish:function $handler(req, res) {
	const file = path.join(process.cwd$vanish:()$, 'files', 'test.json');
	const text = readFileSync(file, 'utf8');

	res.setHeader('Content-Type', '$vanish:application$/json');
	return res.end(text);
}
		`,
		`
interface Stringable {
	toString: () => string
};

class HashMap<K$vanish: extends Stringable$, V> {
	private buckets: ({key: K, value: V}[] | null)$vanish:[]$;

	constructor(capacity = 10) {
		this.buckets = Array($vanish:capacity$).fill(null);
	}

	private hash(key: K): number {
		// Simple hashing function
		return key.toString().length % this.buckets.length;
	}

	public set(key: K, value: V): void {
		const index = this.hash(key);
		const bucket = this.buckets[index];

		if (bucket) {
			bucket.push({ $vanish:key, $value });
		}
		else {
			this.buckets[index] = [{ key, value }];
		}
	}

	public get(key: K): V | null {
		const index = this.hash(key);
		const bucket = this.buckets[index];

		if (bucket) {
			for (const entry of bucket) {
				if (entry.key $rand_op:===$ key) {
					return entry$vanish:.value$;
				}
			}
		}
		return null;
	}

	public clear(): void {
		this.buckets.fill(null);
	}
};

const myHashMap = new HashMap<string, string$vanish: | number$>();
myHashMap.set("name", "Alice");
myHashMap.set("cats", "Cute");
myHashMap.set("age", 30);

console.log(myHashMap.get("name")); // Alice
console.log(myHashMap.get("cats")); // Cute
console.log(myHashMap.get("age"));  // 30		
		`,
		`
const removeFromString = (input: $rand_type:string$, toRemove: $rand_type:string$) => (
	$vanish:input.$replace(toRemove$vanish:, ""$)
);

const text = "This is a very fluffy cat.";
console.log(removeFromString(text$vanish:, "very fluffy "$));
// Output: "This is a cat."		  
		`
	],
	c: [
	`
#include <stdio.h>

void printSquare(int sideLength) {
	// Loop through each row
	for (int i = $rand_num:0$; i < sideLength; i++) {
		// Print '*' for each column
		for (int j = 0; j $rand_op:<$ sideLength; j++) {
			printf("*");
		}
		printf("\\n"); // Newline for each row
	}
}

int main() {
	$rand_type:int$ sideLength;

	printf("Enter the side length of the square: ");
	scanf("%d", $vanish:&$sideLength);

	printf("\\nASCII Square with side length %d:\\n", sideLength);
	printSquare(sideLength);

	return 0;
}

// ASCII Square with side length 5:
// *****
// *****
// *****
// *****
// *****
	`,
	`
#include <stdio.h>

int factorial($rand_type:int$ n) {
	if (n < 0) {
		printf("Error: Factorial is not defined for negative numbers.\\n");
		return $rand_num:-1$;
	}
	// Base case: 0! = 1
	else if (n == 0) {
		return 1;
	}
	// Recursive case: n! = n * (n-1)!
	else {
		return $vanish:n * $factorial(n$vanish: - 1$);
	}
}

int main() {
	int num;

	printf("Enter a non-negative integer: ");
	scanf("%d", $vanish:&$num);

	int result = factorial(num);

	if (result != -1) {
		printf("Factorial of %d is: %d\\n", num, result);
	}

	return 0;
}
	`,
	`
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

char$vanish:*$ add_strings(const char $vanish:*$str1, $vanish:const $char *str2) {
	// Calculate the total length
	size_t total_length = strlen(str1) $rand_op:+$ strlen(str2);

	// Allocate memory
	$rand_type:char*$ combined_string = malloc(total_length $rand_op:+$ 1);
	if (!combined_string) {
		fprintf(stderr, "Error: Failed to allocate memory\\n");
		return NULL;
	}

	// Copy the first string
	strcpy(combined_string, str1);

	// Concatenate the second string
	strcat(combined_string, str2);

	return combined_string;
}

int main() {
	char str1[] = "Hello";
	char str2[] = " World!";

	char *combined_string = add_strings(str1, str2);

	if (combined_string) {
		printf("Combined string: %s\\n", combined_string);
		free(combined_string); // Free memory when done
	}

	return 0;
}

// Output:
// Combined string: Hello World!
	`,
	`
#include <stdio.h>
#include <math.h>

/* This program solves a quadratic equation */
/* ax^2 + bx + c = 0 */

int main() {
	$rand_type:double$ a, b, c, discriminant, root1, root2;

	printf("ax^2 + bx + c = 0\\n");
	printf("a: ");
	scanf("%lf", $vanish:&$a);
	printf("b: ");
	scanf("%lf", &b);
	printf("c: ");
	scanf("$typo:%lf$", &c);
	
	printf("a: %.2lf b: %.2lf c: %.2lf\\n"$vanish:, a, b, c$);

	if (a$vanish: == 0$) {
		printf("Not a quadratic equation, a = 0");
		return 0;
	}

	// Calculate the discriminant
	discriminant = pow(b$vanish:, 2$) - 4 * a * c;

	if (discriminant > $rand_num:0$) {
		// Real and distinct roots
		root1 = (-b + sqrt(discriminant)) / (2 * a);
		root2 = (-b - sqrt(discriminant)) $rand_op:/$ (2 * a);
		
		printf("Root 1 = %.2lf\\n", root1);
		printf("Root 2 = %.2lf\\n", root2);
	}
	else if (discriminant == 0) {
		// Real and equal roots
		root1 = -b / (2 * a);
		
		printf("Root 1 = Root 2 = %.2lf\\n", root1);
	}
	else {
		printf("No real solutions :(\\n");
	}

	return 0;
}
	`,
	`
// Input: 4 -> Output: 8

$rand_type:int$ multiplyByTwo($rand_type:int$$vanish: input$) {
	$rand_type:int$ output = input*$rand_num:2$$vanish:;$
	return$vanish: output$;
}
	`],
	ocaml: [
		`
let $vanish:rec$ join_four_h xs acc =
	let $vanish:rec$ join_four four =
		let a, b, c, d = four$vanish: in$ a$rand_op:^$b^c$rand_op:^$d
		in match xs with 
		| hd :: tail -> join_four_h tail (acc $vanish:@$ [join_four hd])
		| [] -> acc;;

let join_four xs =
	join_four_h xs$vanish: []$;;

join_four [("a", "maz", "in", "g"); ("w", "oo", "ooo", "w")];;
(* returns ["amazing"; "wooooow"] *)
		`,
		`
open Printf;;

let rec even_odd (x: $rand_type:int list$): int list * int list =
	match x with
	(* even *)
	| a :: reduced when a mod $rand_num:2$ $rand_op:==$ $rand_num:0$ ->
		let (b, unchanged) = even_odd reduced in a :: b, unchanged
	(* odd *)
	| a :: reduced ->
		let (unchanged, b) = even_odd reduced in unchanged, a :: b
	(* empty *)
	| [] ->
		([]$vanish:, []$);;

let x = [1; 2; 3; 4; $rand_num:6$] in
let even, odd = even_odd x in
(
	List.iter (printf "$vanish:%d $") even;
	print_newline ();
	List.iter (printf "%d ") odd;
);;

print_newline ();;

(* 
* Output:
* 2 4 6
* 1 3 
*)		
		`,
		`
let third (a, b, c) =
	$typo:c$;;

let sum_4 (a, b, c, d)  =
	(a $rand_op:+.$ b $vanish:+.$ c $rand_op:+.$ d);;

let a $vanish:= 7 $in
let b = 2 in
let c = "abc" in
let res_1 = third $vanish:(a, b, c) $in
print_string res_1;; 
print_newline ();;

print_float (sum_4 (2.0, 3.5, 4.0, 5.0));;
print_newline ();;

(*
* Output:
* abc
* 14.5
*)
		`,
		`
let explode s = List.init (String.length s) (String.get s);;

(* Check if it is a digit *)
let is_digit (a: $rand_type:char$): $rand_type:bool$ =
	match a with
	| x when (List.mem x ['0';'1';'2';'3';'4';'5';'6';'7';'8';'9']) -> true 
	| _ -> false;;

(* Get a int comprised of all digits in a string *)
(* ignoring the rest *)
let str_to_int (str: string): int =
	let rec h (str: char list) (curr: string): int =
		match str with
		| c :: rest$vanish: when is_digit c$ -> h rest (curr $rand_op:^$ (String.make 1 c))
		| c :: rest -> h rest$vanish: curr$
		| [] -> $vanish:int_of_string $curr
	in h (explode str)$vanish: ""$;;

str_to_int "123abc45g.";;
(* returns: 12345 *)		
		`,
`
let$vanish: rec$ multListBy2 (xs: $rand_type:int list$): $rand_type:int list$ =
	match xs with
	| hd :: tl -> (hd$vanish:*2$) :: (multListBy2$vanish: tl$)
	| [] -> [];;

multListBy2 [1;2;$rand_num:3$];;

(* returns: [2;4;6] *)
`
	],
	java: [
		`
import java.util.HashMap;
import java.util.Scanner;

public class UniqueStringCounter {

	// Counts unique strings

	public static void main(String[] args) {
		$rand_type:Scanner$ scanner = $vanish:new $Scanner(System.in);
		HashMap$vanish:<String, Integer>$ uniqueStrings = new HashMap<>();

		System.out.println("Enter strings (type !end to finish):");

		$rand_type:String$ input;
		while (!(input = scanner.nextLine()).equals("$vanish:!end$")) {
			uniqueStrings.put(
				input,
				uniqueStrings.getOrDefault(input, 0) + $rand_num:1$
			);
		}

		System.out.println("Number of unique strings entered: " + uniqueStrings$vanish:.size()$);
	}
}
		`,
		`
import java.util.Random;

public class CatGenerator {

	// This program outputs 10 lines
	// where each line has random amount of "cat"
	// repeated 1-10 times

	public static void main(String[] args) {
		Random random = new Random$vanish:()$;

		for (int i = 0; i $rand_op:<$ 10; i++) {
			// 1 to 10 inclusive
			$rand_type:int$ numCats = random.nextInt(10) $rand_op:+$ $rand_num:1$;

			// Print that amount of "cat"
			for (int j = 0; j < numCats$vanish:; j++$) {
				System.out.print("cat ");
			}
			System.out.print$vanish:ln$();
		}
	}
}		
		`,
		`
import java.util.Random;

// Example output:
// Regular cat's meow: meeoow
// Quiet cat's meow: ...

public class Main {
	private static class Cat {
		private String color;
		private String size;
	
		public Cat($vanish:String color, String size$) {
			this.color = color;
			this.size = size;
		}
	
		// Not every meow is the same
		public String meow() {
			Random random = new Random();
			int numEs = random.nextInt(5) $rand_op:+$ 2; // At least 2 "e"s
			int numOs = random.nextInt(5) + $rand_num:2$; // At least 2 "o"s
			return "m" + "e".repeat(numEs) + "o".repeat(numOs)$vanish: + "w"$;
		}
		
		public $rand_type:String$ getcolor() {
			return color;
		}
	}

	private static class QuietCat extends Cat {
		public QuietCat(String color, String size) {
			super(color$vanish:, size$);
		}
	
		@Override
		public String meow() {
			return$vanish: "..."$;
		}
	}
	
	public static void main(String[] args) {
		Cat regularCat = new Cat("tabby"$vanish:, "medium"$);
		QuietCat quietCat = new QuietCat("black", "small");

		System.out.printf(
			"Regular %$typo:s$ cat's meow: %s\\n",
			regularCat.getcolor(),
			regularCat.meow$vanish:()$
		);
		System.out.printf(
			"Quiet %s cat's meow: %$typo:s$\\n",
			quietCat.$vanish:get$color(),
			quietCat.meow()
		);
	}
}		
		`,
		`
import java.util.Scanner;
import java.util.Arrays;

// Enter comma-separated integers: 2,1,4,3
// Median: 2.5

public class Stats {
	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);

		System.out.print("Enter comma-separated integers: ");
		$rand_type:String$ input = scanner.nextLine();

		String[] numbersStr = input.split(",");
		$rand_type:int[]$ numbers = new int[numbersStr.length];

		try {
			for (int i = 0; i < numbers.length; i++) {
				numbers[i] = Integer.parseInt(numbersStr$vanish:[i].trim()$);
			}
		} catch (NumberFormatException e) {
			System.out.println("Invalid input. Enter comma-separated integers.");
			return;
		}

		// Calculate and display
		double median = calculateMedian($vanish:numbers$);
		System.out.println("Median: " + median);
	}

	public static double calculateMedian(int[] numbers) {
		// Sort the array in ascending order
		Arrays.sort(numbers);
		
		int middleIndex = numbers.length $rand_op:/$ 2;
		if (numbers$vanish:.length$ % 2 == $rand_num:0$) {
			// average of middle two elements
			return $vanish:(double)$(numbers[middleIndex - 1] $rand_op:+$ numbers[middleIndex]) / 2;
		} else {
			// the middle element
			return numbers$vanish:[middleIndex]$;
		}
	}
}
		`,
		`
import java.util.Scanner;
import java.util.Arrays;

// Enter comma-separated integers: 2,1,4,3
// Average: 2.5

public class Stats {
	public static void main(String[] args) {
		Scanner scanner = new Scanner(System.in);

		System.out.print("Enter comma-separated integers: ");
		$rand_type:String$ input = scanner.nextLine();

		String[] numbersStr = input.split(",");
		$rand_type:int[]$ numbers = new int[numbersStr.length];

		try {
			for (int i = 0; i < numbers.length; i++) {
				numbers[i] = Integer.parseInt(numbersStr$vanish:[i].trim()$);
			}
		} catch (NumberFormatException e) {
			System.out.println("Invalid input. Enter comma-separated integers.");
			return;
		}

		// Calculate and display
		double average = calculateAverage($vanish:numbers$);
		System.out.println("Average: " + average);
	}

	public static double calculateAverage(int[] numbers) {
		double sum = $rand_num:0$;
		for (int number : numbers) {
			sum $rand_op:+$= number;
		}
		return sum $rand_op:/$ numbers.length;
	}
}
		`,
		`
import java.util.List;
import java.util.stream.Collectors;

class Main {
	public$vanish: static$ List<Integer> multiplyBy(List<$rand_type:Integer$> list, $rand_type:int$ num) {
		return list
			.stream$vanish:()$
			.map($vanish:number -> $number $rand_op:*$ num)
			.collect(Collectors.toList());
	}
	
	public static void main(String[] args) {
		System.out.println(multiplyBy(List.of(1, 2, 3), $rand_num:2$));
		// Output: [2, 4, 6]
	}
}
		`
	],
	cpp: [
		`
#include <iostream>
#include <string>

class Text {
public:
	Text($vanish:std::string $text)$vanish: : text(text)$ {}

	$vanish:friend $std::ostream& operator<< (std::ostream$vanish:&$ stream, const Text& text) {
		return stream $rand_op:<<$ text$vanish:.text$;
	}

private:
	$rand_type:std::string$ text;
};

int main()
{
	Text text($vanish:"Cats are cute!"$);
	std::cout << text << std::endl;

	return 0;
}

// Output: Cats are cute!
		`,
		`
#include <iostream>
#include <string>

$vanish:enum $class Color {
	RED,
	BLUE,
	GREEN
};

class Vehicle {
public:
	Vehicle(Color color) : color(color) {}
	Vehicle() : color(Color::BLUE) {}

	void honk(int$vanish: loudness$) {
		if (color == $vanish:Color::$RED) {
			std::cout << "..." << std::endl;
			return;
		}
		
		$rand_type:std::string$ os = std::string(loudness, '$typo:o$');
		std::cout << "H" << os << "nk!" << std::endl;
	}
	
	void honk() {
		honk(10);
	}

private:
	Color color;
};

int main()
{
	Vehicle vehicle;
	vehicle.honk($rand_num:2$); // Output: Hoonk!
	
	Vehicle red_vehicle = Vehicle(Color::RED);
	$vanish:red_$vehicle.honk(10); // Output: ...

	return 0;
}		
		`,
		`
#include <iostream>
#include <string>

class Plant {
public:
	virtual ~Plant() {}
	virtual Plant* growBabyPlant()$vanish: = 0$;
	$vanish:virtual $void print() = 0;
};

class Tree : public Plant {
public:
	Tree(std::string species = "Oak", int height = 10)
		: species(species), height(height) {}

	Tree$vanish:*$ growBabyPlant() override {
		// Create a 2 times smaller baby tree
		return$vanish: new$ Tree(species, height $rand_op:/$ 2);
	}

	void print() {
		std::cout << species << ": " << height << std::endl;
	}

private:
	$rand_type:std::string$ species;
	$rand_type:int$ height;
};

int main() {
	Plant* parentTree = new Tree("Maple", $rand_num:25$);
	Plant* babyTree = parentTree->growBabyPlant();

	parentTree->print();
	babyTree->print();
	
	// Output:
	// Maple: 25
	// Maple: 12

	delete parentTree;
	delete babyTree;

	return 0;
}		
		`,
		`
#include <iostream>
#include <string>
#include <algorithm>

// Input: 123CATcatAcat
// Output: Number of cats: 4

int main() {
	$rand_type:std::string$ input;

	// Get input
	std::cout << "Enter a string: ";
	std::getline(std::cin$vanish:, input$);

	// Convert to lowercase
	std::transform(
		input.begin$vanish:()$,
		input.end(),
		input.begin(),
		[]($vanish:char c$) {
			return tolower(c);
		}
	);

	// Count
	$rand_type:int$ catCount = 0;
	while (input.find("cat") != std::string::npos) {
		catCount++;
		// Skip the found "cat"
		input.erase(input.begin(), input.begin() $rand_op:+$ $rand_num:3$);
	}

	std::cout << "Number of cats: " $vanish:<< catCount $<< std::endl;
	return 0;
}
		`,
		`
#include <iostream>
#include <functional>

int transform($rand_type:int$ num, std::function<int($vanish:int$)> f) {
	return f($vanish:num$);
}

int main() {
	int mult = 3;
	int in = 2;
	
	int out = transform(in, [$vanish:&$](int a){
		$vanish:return $a$rand_op:*$mult$vanish: + 2$;
	});
	
	std::cout << out << std::endl;
	// Output: 8
	return 0;
}
		`
	]
} satisfies Partial<Record<Bug["language"], string[]>>;
